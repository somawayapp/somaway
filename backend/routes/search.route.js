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
  return crypto.createHash('sha256').update(phone).digest('hex');
}

// --- Helper Functions for Decryption (Copied from mpesa.router.js) ---
function decrypt(text) {
  if (!text || typeof text !== 'string') {
    // console.warn("Attempted to decrypt invalid or empty text:", text);
    return null; // Or throw an error, depending on desired behavior
  }
  try {
    const textParts = text.split(":");
    if (textParts.length !== 2) {
      console.error("Invalid encrypted text format for decryption:", text);
      return null;
    }
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption failed:", error.message, "Text:", text);
    return null; // Return null or re-throw if decryption fails
  }
}

// --- Helper: Format phone number to 2547XXXXXXXX (Copied from mpesa.router.js) ---
function formatPhoneNumber(phone) {
  if (!phone) return null;

  let digits = phone.replace(/\D/g, ""); // Remove non-digit chars

  if (digits.startsWith("0")) {
    digits = "254" + digits.slice(1);
  } else if (digits.startsWith("7")) {
    digits = "254" + digits;
  } else if (digits.startsWith("+254")) {
    digits = digits.slice(1); // remove plus sign
  }

  // Optionally validate length and ensure it's a mobile number
  if (digits.length !== 12 || !digits.startsWith("2547")) {
    return null;
  }

  return digits;
}

// --- Search Route ---
router.get("/", async (req, res) => {
  let { phone } = req.query; // Get phone from query parameters

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required for search." });
  }

  // Format and hash the incoming phone number for search
  const formattedPhone = formatPhoneNumber(phone);
  if (!formattedPhone) {
    return res.status(400).json({ success: false, message: "Invalid phone number format." });
  }
  const phoneNumberHash = hashPhoneNumber(formattedPhone);

  try {
    // Find entries that are 'Completed' and match the phone hash
    const foundEntries = await EntryModel.find({
      phoneNumberHash: phoneNumberHash,
      status: "Completed",
      // You might also want to search across all cycles or a specific cycle
      // cycle: CURRENT_CYCLE, // Uncomment and define if you want to search only current cycle
    }).sort({ createdAt: -1 }); // Show most recent first

    if (foundEntries.length === 0) {
      return res.status(200).json({ success: true, message: "No completed entries found for this phone number.", results: [] });
    }

    // Decrypt the relevant fields for the results
    const decryptedResults = foundEntries.map(entry => ({
      name: decrypt(entry.name),
      phone: decrypt(entry.phone), // Send back the decrypted phone to confirm
      amount: entry.amount,
      mpesaReceiptNumber: entry.mpesaReceiptNumber,
      status: entry.status,
      createdAt: entry.createdAt,
      cycle: entry.cycle,
    }));

    // Filter out any entries where decryption might have failed (e.g., null name/phone)
    const filteredResults = decryptedResults.filter(result => result.name !== null && result.phone !== null);

    res.json({
      success: true,
      message: `${filteredResults.length} completed entries found.`,
      results: filteredResults,
    });

  } catch (error) {
    console.error("Error during participant search:", error);
    res.status(500).json({ success: false, message: "Server error during search." });
  }
});

export default router;