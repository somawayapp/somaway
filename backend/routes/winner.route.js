import express from "express";
import crypto from "crypto";
import EntryModel from "../models/Entry.model.js";
import WinnerModel from "../models/Winner.model.js";

const router = express.Router();
const CURRENT_CYCLE = 1;
const MAX_PARTICIPANTS = 1000000; // or however many you're using
const publicSeed = "0000000000000000001a7c2139b7b72e00000000000000000000000000000000"; // fixed per cycle

// GET latest winner
router.get("/", async (req, res) => {
  try {
    const winner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
    if (!winner) return res.json({ success: false, message: "No winner yet" });
    res.json({ success: true, winner });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch winner" });
  }
});

// POST to pick and save winner
router.post("/", async (req, res) => {
  try {
    const entries = await EntryModel.find({ status: "Completed", cycle: CURRENT_CYCLE });

    const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
    if (entries.length < MAX_PARTICIPANTS || totalAmount < MAX_PARTICIPANTS) {
      return res.json({ success: false, message: "Target not yet met." });
    }

    const existing = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });
    if (existing) return res.json({ success: false, message: "Winner already picked." });

    const participantHashes = entries.map((entry, i) =>
      crypto.createHash("sha256").update(`${i}-${entry.phoneNumberHash}`).digest("hex")
    );

    const combinedHashes = participantHashes.map(h =>
      crypto.createHash("sha256").update(publicSeed + h).digest("hex")
    );

    const scores = combinedHashes.map(h => parseInt(h.slice(0, 8), 16));
    const winnerIndex = scores.indexOf(Math.min(...scores));
    const winnerEntry = entries[winnerIndex];

    const winnerDoc = await WinnerModel.create({
      entryId: winnerEntry._id,
      name: winnerEntry.name,
      phone: winnerEntry.phone,
      phoneNumberHash: winnerEntry.phoneNumberHash,
      amount: winnerEntry.amount,
      location: winnerEntry.location,
      cycle: CURRENT_CYCLE,
      transactionId: winnerEntry.transactionId,
      mpesaReceiptNumber: winnerEntry.mpesaReceiptNumber,
      publicRandomSeed: publicSeed,
    });

    res.json({ success: true, winner: winnerDoc });
  } catch (err) {
    console.error("Error selecting winner:", err);
    res.status(500).json({ success: false, error: "Winner selection failed" });
  }
});

export default router;
