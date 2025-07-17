// routes/search.router.js
import express from "express";
import EntryModel from "../models/Entry.model.js";
import crypto from "crypto"; // For hashing and decryption
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Encryption Configuration (MUST BE THE SAME AS YOUR M-PESA ROUTER)
// IMPORTANT: In a real application, load this from environment variables (e.g., process.env.ENCRYPTION_KEY)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16; // For AES-256-CBC

// --- Helper Function for Hashing ---
function hashPhoneNumber(phone) {
  const hashed = crypto.createHash('sha256').update(phone).digest('hex');
  console.log(`[HashPhoneNumber] Hashed '${phone}' to '${hashed}'`);
  return hashed;
}

// --- Helper Functions for Decryption (Still needed for displaying results) ---
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
  } else if (digits.startsWith("7") && digits.length === 9) { // Added length check for '7' start
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

// --- Main Search Route (Direct Hash Query) ---
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
  console.log(`[Search Route] Hashed incoming phone for direct DB search: ${searchPhoneNumberHash}`);

  try {
    // DIRECT DATABASE QUERY USING phoneNumberHash
// Assuming searchPhoneNumberHash is already defined from a hashed input phone number

const foundEntries = await EntryModel.find({
  phoneNumberHash: searchPhoneNumberHash, // Direct comparison with the generated hash
  status: { $in: ["Completed", "Failed", "Pending", "Cancelled", "Query_Failed"] }, // Use $in operator to match any of these statuses
}).sort({ createdAt: -1 }); // Sort by creation date, newest first

    console.log(`[Search Route] Found ${foundEntries.length} entries matching hash '${searchPhoneNumberHash}' and status 'Completed'.`);

    if (foundEntries.length === 0) {
      console.log("[Search Route] No completed entries found for this phone number via direct hash search.");
      return res.status(200).json({ success: true, message: "No completed entries found for this phone number.", results: [] });
    }

    // Decrypt the relevant fields for the results that *were* found
    const decryptedResults = foundEntries.map(entry => ({
      _id: entry._id,
      name: decrypt(entry.name),
      phone: decrypt(entry.phone), // Decrypt for display
      amount: entry.amount,
      mpesaReceiptNumber: entry.mpesaReceiptNumber,
      status: entry.status,
      createdAt: entry.createdAt,
      cycle: entry.cycle,
      phoneNumberHash: entry.phoneNumberHash // Include the stored hash for debugging
    }));

    // Filter out any entries where decryption might have failed
    const filteredResults = decryptedResults.filter(result => result.name !== null && result.phone !== null);

    console.log(`[Search Route] Successfully found and decrypted ${filteredResults.length} completed entries.`);

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


// --- ADMIN Route: Get and Decrypt All Completed Entries (for inspection/debugging) ---
router.get("/admin/decrypt-all-completed", async (req, res) => {
    console.log("\n[Admin Decrypt Route] Attempting to retrieve and decrypt all completed entries.");
    try {
        const completedEntries = await EntryModel.find({ status: "Completed" }).sort({ createdAt: -1 });
        console.log(`[Admin Decrypt Route] Found ${completedEntries.length} completed entries in the database.`);

        if (completedEntries.length === 0) {
            return res.status(200).json({ success: true, message: "No completed entries found to decrypt.", results: [] });
        }

        const decryptedData = completedEntries.map(entry => {
            const decryptedName = decrypt(entry.name);
            const decryptedPhone = decrypt(entry.phone);

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
                phoneNumberHash: entry.phoneNumberHash // Also include the stored hash in the API response
            };
        });

        // Filter out any entries where decryption of essential fields might have failed
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

export default router;