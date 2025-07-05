// routes/search.router.js
import express from "express";
import EntryModel from "../models/Entry.model.js";
import crypto from "crypto"; // For hashing and decryption

const router = express.Router();

// Encryption Configuration (MUST BE THE SAME AS YOUR M-PESA ROUTER)
const ENCRYPTION_KEY = "8ab21ec1dd828cc6409d0ed55b876e0530dfbccd67e56f1318e684e555896f3d"; // Use a strong, environment-variable-stored key in production
const IV_LENGTH = 16; // For AES-256-CBC

// --- Helper Function for Hashing (Copied from mpesa.router.js) ---
function hashPhoneNumber(phone) {
  // Always hash the *formatted* phone number
  const hashed = crypto.createHash('sha256').update(phone).digest('hex');
  console.log(`[HashPhoneNumber] Hashed '${phone}' to '${hashed}'`);
  return hashed;
}

// --- Helper Functions for Decryption (Copied from mpesa.router.js) ---
function decrypt(text) {
  if (!text || typeof text !== 'string') {
    // console.warn("[Decrypt] Attempted to decrypt invalid or empty text:", text); // Keep this if you want to see warnings for every null/invalid text
    return null; // Or throw an error, depending on desired behavior
  }
  try {
    const textParts = text.split(":");
    if (textParts.length !== 2) {
      console.error("[Decrypt] Invalid encrypted text format for decryption:", text);
      return null;
    }
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("[Decrypt] Decryption failed:", error.message, "Text (partial):", text.substring(0, 30) + "..."); // Log partial text for errors
    return null; // Return null or re-throw if decryption fails
  }
}

// --- Helper: Format phone number to 2547XXXXXXXX (Copied from mpesa.router.js) ---
function formatPhoneNumber(phone) {
  console.log(`[FormatPhoneNumber] Original phone: ${phone}`);
  if (!phone) {
    console.log("[FormatPhoneNumber] Phone number is null or empty.");
    return null;
  }

  let digits = phone.replace(/\D/g, ""); // Remove non-digit chars
  console.log(`[FormatPhoneNumber] Digits after non-digit removal: ${digits}`);

  if (digits.startsWith("0")) {
    digits = "254" + digits.slice(1);
    console.log(`[FormatPhoneNumber] Started with 0, formatted to: ${digits}`);
  } else if (digits.startsWith("7") && digits.length === 9) { // Assuming 07xxxxxxxx, so 7xxxxxxxx is 9 digits
    digits = "254" + digits;
    console.log(`[FormatPhoneNumber] Started with 7, formatted to: ${digits}`);
  } else if (digits.startsWith("+254")) {
    digits = digits.slice(1); // remove plus sign
    console.log(`[FormatPhoneNumber] Started with +254, formatted to: ${digits}`);
  }

  // Optionally validate length and ensure it's a mobile number
  if (digits.length !== 12 || !digits.startsWith("2547")) {
    console.warn(`[FormatPhoneNumber] Final formatted number '${digits}' is invalid. Length: ${digits.length}, Starts with 2547: ${digits.startsWith("2547")}`);
    return null;
  }
  console.log(`[FormatPhoneNumber] Successfully formatted to: ${digits}`);
  return digits;
}

// --- NEW HELPER FUNCTION: Log all data in DB (for internal use) ---
async function logAllDbData() {
    console.log("\n------------------------------------------------------------------");
    console.log("[GLOBAL LOG ALL DB DATA] Starting to fetch and log ALL entries from the database.");
    console.log("------------------------------------------------------------------");
    try {
        const allEntries = await EntryModel.find({}); // Fetch ALL entries
        console.log(`[GLOBAL LOG ALL DB DATA] Found ${allEntries.length} total entries in the database.`);

        if (allEntries.length === 0) {
            console.log("[GLOBAL LOG ALL DB DATA] No entries found in the database to log.");
        } else {
            allEntries.forEach(entry => {
                const decryptedName = decrypt(entry.name);
                const decryptedPhone = decrypt(entry.phone);

                console.log(`
                    [GLOBAL LOG ALL DB DATA] Entry ID:       ${entry._id}
                    [GLOBAL LOG ALL DB DATA] Name (Decrypted): ${decryptedName}
                    [GLOBAL LOG ALL DB DATA] Phone (Decrypted): ${decryptedPhone}
                    [GLOBAL LOG ALL DB DATA] Hashed Phone:     ${entry.phoneNumberHash}
                    [GLOBAL LOG ALL DB DATA] Amount:           ${entry.amount}
                    [GLOBAL LOG ALL DB DATA] M-Pesa Receipt:   ${entry.mpesaReceiptNumber}
                    [GLOBAL LOG ALL DB DATA] Status:           ${entry.status}
                    [GLOBAL LOG ALL DB DATA] Created At:       ${entry.createdAt}
                    [GLOBAL LOG ALL DB DATA] Cycle:            ${entry.cycle}
                    ------------------------------------------------------------------
                `);
            });
            console.log(`[GLOBAL LOG ALL DB DATA] Finished logging ${allEntries.length} entries.`);
        }

    } catch (error) {
        console.error("[GLOBAL LOG ALL DB DATA] Error fetching and logging all entries:", error);
    } finally {
        console.log("------------------------------------------------------------------\n");
    }
}


// --- Main Search Route ---
router.get("/", async (req, res) => {
  // First, log all data as requested, before processing the search query
  await logAllDbData(); // This will now execute on every call to this route

  let { phone } = req.query; // Get phone from query parameters
  console.log(`[Search Route] Received search request for phone: ${phone}`);

  if (!phone) {
    console.log("[Search Route] Phone number is missing from query.");
    return res.status(400).json({ success: false, message: "Phone number is required for search." });
  }

  const formattedPhone = formatPhoneNumber(phone);
  if (!formattedPhone) {
    console.log(`[Search Route] Invalid phone number format for input: ${phone}`);
    return res.status(400).json({ success: false, message: "Invalid phone number format." });
  }
  const phoneNumberHash = hashPhoneNumber(formattedPhone);
  console.log(`[Search Route] Searching for entries with phoneNumberHash: ${phoneNumberHash}`);

  try {
    const foundEntries = await EntryModel.find({
      phoneNumberHash: phoneNumberHash,
      status: "Completed",
    }).sort({ createdAt: -1 });

    console.log(`[Search Route] Found ${foundEntries.length} completed entries for hash: ${phoneNumberHash}`);

    if (foundEntries.length === 0) {
      return res.status(200).json({ success: true, message: "No completed entries found for this phone number.", results: [] });
    }

    const decryptedResults = foundEntries.map(entry => {
      const decryptedName = decrypt(entry.name);
      const decryptedPhone = decrypt(entry.phone);
      console.log(`[Search Route] Decrypting entry ID: ${entry._id} - Name: ${decryptedName ? 'Decrypted' : 'Failed'}, Phone: ${decryptedPhone ? 'Decrypted' : 'Failed'}`);
      return {
        name: decryptedName,
        phone: decryptedPhone,
        amount: entry.amount,
        mpesaReceiptNumber: entry.mpesaReceiptNumber,
        status: entry.status,
        createdAt: entry.createdAt,
        cycle: entry.cycle,
      };
    });

    const filteredResults = decryptedResults.filter(result => result.name !== null && result.phone !== null);

    console.log(`[Search Route] ${filteredResults.length} entries remaining after decryption and filtering.`);

    res.json({
      success: true,
      message: `${filteredResults.length} completed entries found.`,
      results: filteredResults,
    });

  } catch (error) {
    console.error("[Search Route] Error during participant search:", error);
    res.status(500).json({ success: false, message: "Server error during search." });
  }
});


// (Optional: You can keep or remove this if no longer needed, as the main route now logs all)
// --- ADMIN Route: Get and Decrypt All Completed Entries ---
router.get("/admin/decrypt-all-completed", async (req, res) => {
    console.log("[Admin Decrypt Route] Attempting to retrieve and decrypt all completed entries.");
    try {
        const completedEntries = await EntryModel.find({ status: "Completed" }).sort({ createdAt: -1 });
        console.log(`[Admin Decrypt Route] Found ${completedEntries.length} completed entries in the database.`);

        if (completedEntries.length === 0) {
            return res.status(200).json({ success: true, message: "No completed entries found to decrypt.", results: [] });
        }

        const decryptedData = completedEntries.map(entry => {
            const decryptedName = decrypt(entry.name);
            const decryptedPhone = decrypt(entry.phone);

            console.log(`[Admin Decrypt Route] Decrypted Entry ID: ${entry._id}, Phone: ${decryptedPhone}, Name: ${decryptedName}, Status: ${entry.status}`);

            return {
                _id: entry._id,
                name: decryptedName,
                phone: decryptedPhone,
                amount: entry.amount,
                mpesaReceiptNumber: entry.mpesaReceiptNumber,
                status: entry.status,
                createdAt: entry.createdAt,
                cycle: entry.cycle,
                phoneNumberHash: entry.phoneNumberHash
            };
        });

        const filteredDecryptedData = decryptedData.filter(item => item.name !== null && item.phone !== null);

        console.log(`[Admin Decrypt Route] ${filteredDecryptedData.length} entries successfully decrypted after filtering.`);

        res.json({
            success: true,
            message: `Successfully retrieved and decrypted ${filteredDecryptedData.length} completed entries.`,
            results: filteredDecryptedData,
        });

    } catch (error) {
        console.error("[Admin Decrypt Route] Error decrypting all completed entries:", error);
        res.status(500).json({ success: false, message: "Server error during decryption of all completed entries." });
    }
});


// (Optional: You can remove this if no longer needed, as its logic is now in logAllDbData() called by main route)
// --- ADMIN Route: Log All Data in the DB (EntryModel) ---
router.get("/admin/log-all-db-data", async (req, res) => {
    // This route now just calls the helper function and sends a response.
    // The actual logging happens in logAllDbData().
    await logAllDbData();
    res.json({ success: true, message: "All database entries have been logged to the console." });
});


export default router;