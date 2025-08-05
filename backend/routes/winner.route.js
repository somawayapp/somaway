import express from "express";
import crypto from "crypto";
import EntryModel from "../models/Entry.model.js";
import WinnerModel from "../models/Winner.model.js";

const router = express.Router();

const CURRENT_CYCLE = 1;
const MAX_PARTICIPANTS = 2;
const PUBLIC_SEED = "0000000000000000001a7c2139b7b72e00000000000000000000000000000000"; // Fixed, auditable

// Encryption config
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
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

    // Decrypt and mask
    const decryptedName = decrypt(winner.name);
    const decryptedPhone = decrypt(winner.phone);

    console.log(`[GET /api/winner] Winner found: ${decryptedName}, Phone: ${decryptedPhone}`);

   return res.json({
  success: true,
  winner: {
    ...winner.toObject(),
    name: decrypt(winner.name),
    phone: decrypt(winner.phone),
  },
});


  } catch (err) {
    console.error("[GET /api/winner] Error fetching winner:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/winner - Trigger winner selection
router.post("/", async (req, res) => {
  try {
    console.log(`[POST /api/winner] Starting winner selection for cycle: ${CURRENT_CYCLE}`);

    // 1. Fetch all completed entries
    const entries = await EntryModel.find({ status: "Completed", cycle: CURRENT_CYCLE });
    console.log(`[POST /api/winner] Found ${entries.length} completed entries.`);

    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
    console.log(`[POST /api/winner] Total amount: ${totalAmount}`);

    if (entries.length < MAX_PARTICIPANTS || totalAmount < MAX_PARTICIPANTS) {
      console.log(`[POST /api/winner] Threshold not met. Entries: ${entries.length}, Amount: ${totalAmount}`);
      return res.json({ success: false, message: "Threshold not yet met" });
    }

    // 2. Check if winner already selected
    const existingWinner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
    if (existingWinner) {
      console.log(`[POST /api/winner] Winner already selected`);
      return res.json({ success: false, message: "Winner already selected" });
    }

    // 3. Hash each participant
    const participantHashes = entries.map((entry, index) => {
      const hashInput = `${index}-${entry.phoneNumberHash}`;
      const hashOutput = crypto.createHash("sha256").update(hashInput).digest("hex");
      return hashOutput;
    });

    // 4. Combine with seed and score them
    const scores = participantHashes.map((hash) => {
      const combined = crypto.createHash("sha256").update(PUBLIC_SEED + hash).digest("hex");
      return parseInt(combined.slice(0, 8), 16);
    });

    const winnerIndex = scores.indexOf(Math.min(...scores));
    const winnerEntry = entries[winnerIndex];
    console.log(`[POST /api/winner] Selected winner at index ${winnerIndex}:`, winnerEntry);

    // 5. Save winner with encrypted phone and name
    const savedWinner = await WinnerModel.create({
      entryId: winnerEntry._id,
      name: winnerEntry.name,
      phone: winnerEntry.phone,
      phoneNumberHash: winnerEntry.phoneNumberHash,
      amount: winnerEntry.amount,
      location: winnerEntry.location,
      cycle: CURRENT_CYCLE,
      transactionId: winnerEntry.transactionId,
      mpesaReceiptNumber: winnerEntry.mpesaReceiptNumber,
      publicRandomSeed: PUBLIC_SEED,
    });

    console.log(`[POST /api/winner] Winner saved with ID: ${savedWinner._id}`);
    return res.json({ success: true, winner: savedWinner });
  } catch (err) {
    console.error("[POST /api/winner] Error selecting winner:", err);
    res.status(500).json({ success: false, error: "Failed to select winner" });
  }
});

export default router;
