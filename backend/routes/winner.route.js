import express from "express";
import crypto from "crypto";
import EntryModel from "../models/Entry.model.js";
import WinnerModel from "../models/Winner.model.js";

const router = express.Router();

const CURRENT_CYCLE = 1;
const MAX_PARTICIPANTS = 1000000;
const PUBLIC_SEED = "0000000000000000001a7c2139b7b72e00000000000000000000000000000000"; // Fixed, auditable

// GET /api/winner - Fetch current cycle winner
router.get("/winner", async (req, res) => {
  try {
    const winner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
    if (!winner) return res.json({ success: false, message: "No winner yet" });

    return res.json({ success: true, winner });
  } catch (err) {
    console.error("Error fetching winner:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/winner - Trigger winner selection
router.post("/winner", async (req, res) => {
  try {
    // 1. Fetch all completed entries for current cycle
    const entries = await EntryModel.find({ status: "Completed", cycle: CURRENT_CYCLE });

    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);

    if (entries.length < MAX_PARTICIPANTS || totalAmount < MAX_PARTICIPANTS) {
      return res.json({ success: false, message: "Threshold not yet met" });
    }

    // 2. Check if winner already selected
    const existingWinner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
    if (existingWinner) {
      return res.json({ success: false, message: "Winner already selected" });
    }

    // 3. Hash participants
    const participantHashes = entries.map((entry, index) => {
      return crypto
        .createHash("sha256")
        .update(`${index}-${entry.phoneNumberHash}`)
        .digest("hex");
    });

    // 4. Combine with seed and compute scores
    const combinedHashes = participantHashes.map((hash) =>
      crypto.createHash("sha256").update(PUBLIC_SEED + hash).digest("hex")
    );

    const scores = combinedHashes.map((hash) => parseInt(hash.slice(0, 8), 16));
    const winnerIndex = scores.indexOf(Math.min(...scores));
    const winnerEntry = entries[winnerIndex];

    // 5. Save winner to DB
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

    return res.json({ success: true, winner: savedWinner });
  } catch (err) {
    console.error("Error selecting winner:", err);
    res.status(500).json({ success: false, error: "Failed to select winner" });
  }
});

export default router;
