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

---

## The Working Search Code (Designed for your current data state)

This version prioritizes finding the match based on the **decrypted phone number** for entries marked "Completed", as your database has `undefined` hashes for some records.

```javascript
// --- Main Search Route ---
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
  console.log(`[Search Route] Hashed incoming phone for search (this is what we'll compare against): ${searchPhoneNumberHash}`);

  try {
    // 1. Fetch ALL entries that are 'Completed'.
    // We *cannot* directly query by phoneNumberHash IF it's undefined in some documents.
    // Instead, we'll fetch completed ones and filter in application memory.
    const allCompletedEntries = await EntryModel.find({ status: "Completed" }).sort({ createdAt: -1 });

    console.log(`[Search Route] Found ${allCompletedEntries.length} entries with status 'Completed' in the DB. Now processing them.`);

    const foundMatchingEntries = [];

    // 2. Iterate through each fetched 'Completed' entry, decrypt its phone, re-hash, and compare.
    for (const entry of allCompletedEntries) {
      const decryptedEntryPhone = decrypt(entry.phone); // DECRYPT the stored phone

      if (decryptedEntryPhone) {
        const formattedEntryPhone = formatPhoneNumber(decryptedEntryPhone); // FORMAT the decrypted phone

        if (formattedEntryPhone) {
          const entryPhoneNumberHash = hashPhoneNumber(formattedEntryPhone); // RE-HASH the formatted decrypted phone

          console.log(`[Search Route] Comparing search hash '${searchPhoneNumberHash}' with entry ${entry._id}'s RE-GENERATED hash '${entryPhoneNumberHash}'. Stored hash (may be undefined): ${entry.phoneNumberHash}`);

          if (entryPhoneNumberHash === searchPhoneNumberHash) {
            console.log(`[Search Route] --- !!! MATCH FOUND FOR ENTRY ID: ${entry._id} !!! ---`);
            foundMatchingEntries.push({
              name: decrypt(entry.name), // Decrypt name for results
              phone: decryptedEntryPhone, // Use the decrypted phone in the response
              amount: entry.amount,
              mpesaReceiptNumber: entry.mpesaReceiptNumber,
              status: entry.status,
              createdAt: entry.createdAt,
              cycle: entry.cycle,
              // For debugging, you might still want to see the stored hash (undefined or not)
              storedPhoneNumberHash: entry.phoneNumberHash
            });
          } else {
            console.log(`[Search Route] No hash match for entry ID: ${entry._id}.`);
          }
        } else {
          console.warn(`[Search Route] Could not format decrypted phone for entry ID: ${entry._id}. Skipping.`);
        }
      } else {
        console.warn(`[Search Route] Could not decrypt phone for entry ID: ${entry._id}. Skipping.`);
      }
    }

    if (foundMatchingEntries.length === 0) {
      console.log("[Search Route] No completed entries found for this phone number after thorough checking.");
      return res.status(200).json({ success: true, message: "No completed entries found for this phone number.", results: [] });
    }

    console.log(`[Search Route] Successfully found ${foundMatchingEntries.length} completed entries.`);

    res.json({
      success: true,
      message: `${foundMatchingEntries.length} completed entries found.`,
      results: foundMatchingEntries,
    });

  } catch (error) {
    console.error("[Search Route] Error during participant search:", error);
    res.status(500).json({ success: false, message: "Server error during search." });
  }
});