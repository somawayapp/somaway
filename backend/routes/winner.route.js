import express from "express";
import crypto from "crypto";
import EntryModel from "../models/Entry.model.js";
import WinnerModel from "../models/Winner.model.js";

const router = express.Router();

const CURRENT_CYCLE = 1;
const MAX_PARTICIPANTS = 2;
const PUBLIC_SEED = "0000000000000000001a7c2139b7b72e00000000000000000000000000000000"; // Fixed, auditable

// --- Encryption/Decryption Configuration (Add these based on your project's actual values) ---
// IMPORTANT: Replace these with your actual encryption key and IV length
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your_256_bit_encryption_key_here_as_hex_string"; // e.g., crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16; // For AES-256-CBC, IV length is 16 bytes

// --- Helper Functions for Encryption ---
// (These are provided in your original snippet, included here for completeness)
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  try {
    const textParts = text.split(":");
    if (textParts.length !== 2) {
      console.warn("Invalid encrypted text format for decryption:", text);
      return null; // Or throw an error, depending on desired error handling
    }
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption failed:", error);
    return null; // Return null on decryption failure
  }
}

// --- Helper Function for Phone Number Masking ---
function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.length < 7) {
    return phoneNumber; // Not enough digits to mask
  }
  // Assumes common phone number format (e.g., 0712345678 or +254712345678)
  // Masks the middle 3 digits. Adjust logic if your phone number format varies significantly.
  const len = phoneNumber.length;
  const start = phoneNumber.substring(0, len - 7); // First part before the 7 digits
  const middleMasked = "***"; // Masking the middle 3 digits (e.g., 4th, 5th, 6th from last)
  const end = phoneNumber.substring(len - 4, len); // Last 4 digits
  return `${start}${middleMasked}${end}`;
}

// GET /api/winner - Fetch current cycle winner
router.get("/", async (req, res) => {
  try {
    console.log(`[GET /api/winner] Attempting to fetch winner for cycle: ${CURRENT_CYCLE}`);
    const winner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });

    if (!winner) {
      console.log(`[GET /api/winner] No winner found for cycle: ${CURRENT_CYCLE}`);
      return res.json({ success: false, message: "No winner yet" });
    }

    // Decrypt and mask sensitive information before sending
    const decryptedWinner = { ...winner.toObject() }; // Convert Mongoose document to plain object
    if (decryptedWinner.name) {
      decryptedWinner.name = decrypt(decryptedWinner.name);
    }
    if (decryptedWinner.phone) {
      const decryptedPhone = decrypt(decryptedWinner.phone);
      decryptedWinner.phone = decryptedPhone ? maskPhoneNumber(decryptedPhone) : null;
    }

    console.log(`[GET /api/winner] Winner found for cycle ${CURRENT_CYCLE}:`, decryptedWinner);
    return res.json({ success: true, winner: decryptedWinner });
  } catch (err) {
    console.error("[GET /api/winner] Error fetching winner:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/winner - Trigger winner selection
router.post("/", async (req, res) => {
  try {
    console.log(`[POST /api/winner] Starting winner selection for cycle: ${CURRENT_CYCLE}`);

    // 1. Fetch all completed entries for current cycle
    const entries = await EntryModel.find({ status: "Completed", cycle: CURRENT_CYCLE });
    console.log(`[POST /api/winner] Found ${entries.length} completed entries.`);
    // Log details of fetched entries for verification
    entries.forEach((entry, index) => {
      console.log(`  Entry ${index + 1}: _id=${entry._id}, amount=${entry.amount}, status=${entry.status}, cycle=${entry.cycle}`);
    });

    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
    console.log(`[POST /api/winner] Calculated total amount from entries: ${totalAmount}`);
    console.log(`[POST /api/winner] MAX_PARTICIPANTS set to: ${MAX_PARTICIPANTS}`);

    if (entries.length < MAX_PARTICIPANTS || totalAmount < MAX_PARTICIPANTS) {
      console.log(`[POST /api/winner] Threshold not yet met. Entries: ${entries.length}/${MAX_PARTICIPANTS}, Total Amount: ${totalAmount}/${MAX_PARTICIPANTS}`);
      return res.json({ success: false, message: "Threshold not yet met" });
    }

    // 2. Check if winner already selected
    const existingWinner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
    if (existingWinner) {
      console.log(`[POST /api/winner] Winner already selected for cycle ${CURRENT_CYCLE}. Existing winner ID: ${existingWinner._id}`);
      return res.json({ success: false, message: "Winner already selected" });
    }
    console.log(`[POST /api/winner] No existing winner found for cycle ${CURRENT_CYCLE}. Proceeding to select.`);

    // 3. Hash participants
    const participantHashes = entries.map((entry, index) => {
      const hashInput = `${index}-${entry.phoneNumberHash}`;
      const hashOutput = crypto.createHash("sha256").update(hashInput).digest("hex");
      console.log(`[POST /api/winner] Participant ${index} hash input: "${hashInput}", output: "${hashOutput}"`);
      return hashOutput;
    });
    console.log("[POST /api/winner] All participant hashes generated.");

    // 4. Combine with seed and compute scores
    const combinedHashes = participantHashes.map((hash) => {
      const combinedInput = PUBLIC_SEED + hash;
      const combinedOutput = crypto.createHash("sha256").update(combinedInput).digest("hex");
      console.log(`[POST /api/winner] Combined hash input (PUBLIC_SEED + participant hash): "${combinedInput.substring(0, 50)}...", output: "${combinedOutput}"`); // Truncate long input for logging
      return combinedOutput;
    });
    console.log("[POST /api/winner] All combined hashes generated.");


    const scores = combinedHashes.map((hash) => {
        const score = parseInt(hash.slice(0, 8), 16);
        console.log(`[POST /api/winner] Hash for score: ${hash.slice(0, 8)}, Parsed score: ${score}`);
        return score;
    });
    console.log("[POST /api/winner] All scores computed:", scores);

    const winnerIndex = scores.indexOf(Math.min(...scores));
    console.log(`[POST /api/winner] Minimum score found: ${Math.min(...scores)} at index: ${winnerIndex}`);
    const winnerEntry = entries[winnerIndex];
    console.log("[POST /api/winner] Selected winner entry:", winnerEntry);


    // Decrypt the name and phone from the winnerEntry
    const decryptedWinnerName = decrypt(winnerEntry.name);
    const decryptedWinnerPhone = decrypt(winnerEntry.phone);

    // 5. Save winner to DB
    const savedWinner = await WinnerModel.create({
      entryId: winnerEntry._id,
      name: decryptedWinnerName, // Save decrypted name
      phone: decryptedWinnerPhone, // Save decrypted phone (you might want to store masked here or only decrypt on retrieval)
      phoneNumberHash: winnerEntry.phoneNumberHash,
      amount: winnerEntry.amount,
      location: winnerEntry.location,
      cycle: CURRENT_CYCLE,
      transactionId: winnerEntry.transactionId,
      mpesaReceiptNumber: winnerEntry.mpesaReceiptNumber,
      publicRandomSeed: PUBLIC_SEED,
    });
    console.log(`[POST /api/winner] Winner saved to DB with ID: ${savedWinner._id}`);

    // For the response, mask the phone number and send decrypted name
    const responseWinner = { ...savedWinner.toObject() };
    if (responseWinner.name) {
        responseWinner.name = decryptedWinnerName;
    }
    if (responseWinner.phone) {
        responseWinner.phone = maskPhoneNumber(decryptedWinnerPhone);
    }

// Decrypt sensitive fields
const decryptedName = decrypt(winner.name);
const decryptedPhone = decrypt(winner.phone);

// Mask middle digits of phone (e.g. 0712***345)
const maskedPhone = decryptedPhone.replace(/^(\d{4})\d{3}(\d{3})$/, "$1***$2");

// Return with decrypted + masked fields
return res.json({
  success: true,
  winner: {
    ...winner.toObject(),
    name: decryptedName,
    phone: maskedPhone,
  },
});

} catch (err) {
    console.error("[POST /api/winner] Error selecting winner:", err);
    res.status(500).json({ success: false, error: "Failed to select winner" });
  }
});

export default router;