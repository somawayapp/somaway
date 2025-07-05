// routes/search.router.js
import express from "express";
import EntryModel from "../models/Entry.model.js";
import crypto from "crypto"; // For hashing and decryption

const router = express.Router();

// Encryption Configuration (MUST BE THE SAME AS YOUR M-PESA ROUTER)
const ENCRYPTION_KEY = "8ab21ec1dd828cc6409d0ed55b876e0530dfbccd67e56f1318e684e555896f3d"; // Use a strong, environment-variable-stored key in production
const IV_LENGTH = 16; // For AES-256-CBC

// --- Helper Function for Hashing ---
function hashPhoneNumber(phone) {
  const hashed = crypto.createHash('sha256').update(phone).digest('hex');
  console.log(`[HashPhoneNumber] Hashed '${phone}' to '${hashed}'`);
  return hashed;
}

// --- Helper Functions for Decryption ---
function decrypt(text) {
  if (!text || typeof text !== 'string') {
    return null;
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
    console.error("[Decrypt] Decryption failed:", error.message, "Text (partial):", text.substring(0, 30) + "...");
    return null;
  }
}

// --- Helper: Format phone number to 2547XXXXXXXX ---
function formatPhoneNumber(phone) {
  console.log(`[FormatPhoneNumber] Original phone: ${phone}`);
  if (!phone) {
    return null;
  }

  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    digits = "254" + digits.slice(1);
  } else if (digits.startsWith("7") && digits.length === 9) {
    digits = "254" + digits;
  } else if (digits.startsWith("+254")) {
    digits = digits.slice(1);
  }

  if (digits.length !== 12 || !digits.startsWith("2547")) {
    console.warn(`[FormatPhoneNumber] Final formatted number '${digits}' is invalid.`);
    return null;
  }
  console.log(`[FormatPhoneNumber] Successfully formatted to: ${digits}`);
  return digits;
}

// --- Main Search Route (using only phoneNumberHash and status: "Completed") ---
router.get("/", async (req, res) => {
  let { phone } = req.query; // Get phone from query parameters
  console.log(`\n[Search Route] Received search request for phone: ${phone}`);

  if (!phone) {
    console.log("[Search Route] Phone number is missing from query.");
    return res.status(400).json({ success: false, message: "Phone number is required for search." });
  }

  // Format and hash the incoming phone number for search
  const formattedSearchPhone = formatPhoneNumber(phone);
  if (!formattedSearchPhone) {
    console.log(`[Search Route] Invalid phone number format for input: ${phone}`);
    return res.status(400).json({ success: false, message: "Invalid phone number format." });
  }
  const searchPhoneNumberHash = hashPhoneNumber(formattedSearchPhone);
  console.log(`[Search Route] Hashed incoming phone for search: ${searchPhoneNumberHash}`);

  try {
    // THIS IS THE EXACT SEARCH YOU REQUESTED:
    // Only search using 'phoneNumberHash' and 'status: "Completed"'.
    // Entries with 'phoneNumberHash: undefined' in the DB will NOT be found by this query.
    const foundEntries = await EntryModel.find({
      phoneNumberHash: searchPhoneNumberHash, // Must exactly match the stored hash
      status: "Completed",
    }).sort({ createdAt: -1 });

    console.log(`[Search Route] Query executed using phoneNumberHash: '${searchPhoneNumberHash}' and status: 'Completed'.`);
    if (foundEntries.length === 0) {
      console.log(`[Search Route] Found 0 completed entries for the given phone number hash. This might be because the 'phoneNumberHash' field is missing or undefined in the database for relevant entries.`);
      return res.status(200).json({ success: true, message: "No completed entries found for this phone number.", results: [] });
    }

    // Decrypt the relevant fields for the results
    const decryptedResults = foundEntries.map(entry => {
      const decryptedName = decrypt(entry.name);
      const decryptedPhone = decrypt(entry.phone); // Decrypt phone for the response

      console.log(`[Search Route] Decrypting matched entry ID: ${entry._id} - Name: ${decryptedName ? 'Decrypted' : 'Failed'}, Phone: ${decryptedPhone ? 'Decrypted' : 'Failed'}`);
      return {
        name: decryptedName,
        phone: decryptedPhone, // Send back the decrypted phone to confirm
        amount: entry.amount,
        mpesaReceiptNumber: entry.mpesaReceiptNumber,
        status: entry.status,
        createdAt: entry.createdAt,
        cycle: entry.cycle,
        storedPhoneNumberHash: entry.phoneNumberHash // Show the hash as stored in DB
      };
    });

    // Filter out any entries where decryption might have failed (e.g., null name/phone)
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


// --- ADMIN Route: Get and Decrypt All Completed Entries (for inspection) ---
// This route is separate and useful for debugging the data state.
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

            // This log shows the actual decrypted phone and the stored hash (undefined or not)
            console.log(`[Admin Decrypt Route] Decrypted Entry ID: ${entry._id}, Phone: ${decryptedPhone}, Name: ${decryptedName}, Status: ${entry.status}, Stored Hashed Phone: ${entry.phoneNumberHash}`);

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


// --- ADMIN Route: Log All Data in the DB (for inspection) ---
// This route is separate and useful for debugging the data state.
router.get("/admin/log-all-db-data", async (req, res) => {
    console.log("\n------------------------------------------------------------------");
    console.log("[ADMIN LOG ALL DB DATA] Starting to fetch and log ALL entries from the database.");
    console.log("------------------------------------------------------------------");
    try {
        const allEntries = await EntryModel.find({}); // Fetch ALL entries
        console.log(`[ADMIN LOG ALL DB DATA] Found ${allEntries.length} total entries in the database.`);

        if (allEntries.length === 0) {
            console.log("[ADMIN LOG ALL DB DATA] No entries found in the database to log.");
        } else {
            allEntries.forEach(entry => {
                const decryptedName = decrypt(entry.name);
                const decryptedPhone = decrypt(entry.phone);

                console.log(`
                    [ADMIN LOG ALL DB DATA] Entry ID:       ${entry._id}
                    [ADMIN LOG ALL DB DATA] Name (Decrypted): ${decryptedName}
                    [ADMIN LOG ALL DB DATA] Phone (Decrypted): ${decryptedPhone}
                    [ADMIN LOG ALL DB DATA] Hashed Phone:     ${entry.phoneNumberHash}
                    [ADMIN LOG ALL DB DATA] Amount:           ${entry.amount}
                    [ADMIN LOG ALL DB DATA] M-Pesa Receipt:   ${entry.mpesaReceiptNumber}
                    [ADMIN LOG ALL DB DATA] Status:           ${entry.status}
                    [ADMIN LOG ALL DB DATA] Created At:       ${entry.createdAt}
                    [ADMIN LOG ALL DB DATA] Cycle:            ${entry.cycle}
                    ------------------------------------------------------------------
                `);
            });
            console.log(`[ADMIN LOG ALL DB DATA] Finished logging ${allEntries.length} entries.`);
        }

        res.json({ success: true, message: "All database entries have been logged to the console." });

    } catch (error) {
        console.error("[ADMIN LOG ALL DB DATA] Error fetching and logging all entries:", error);
        res.status(500).json({ success: false, message: "Server error during full database logging." });
    } finally {
        console.log("------------------------------------------------------------------\n");
    }
});


export default router;