import express from "express";
import crypto from "crypto";
import EntryModel from "../models/Entry.model.js";
import WinnerModel from "../models/Winner.model.js";

const router = express.Router();

const CURRENT_CYCLE = 1;
const MAX_PARTICIPANTS = 2;
const PUBLIC_SEED = "0000000000000000001a7c2139b7b72e00000000000000000000000000000000"; // Fixed, auditable

// GET /api/winner - Fetch current cycle winner
router.get("/", async (req, res) => {
  try {
    console.log(`[GET /api/winner] Attempting to fetch winner for cycle: ${CURRENT_CYCLE}`);
    const winner = await WinnerModel.findOne({ cycle: CURRENT_CYCLE });

    if (!winner) {
      console.log(`[GET /api/winner] No winner found for cycle: ${CURRENT_CYCLE}`);
      return res.json({ success: false, message: "No winner yet" });
    }

    console.log(`[GET /api/winner] Winner found for cycle ${CURRENT_CYCLE}:`, winner);
    return res.json({ success: true, winner });
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
    console.log(`[POST /api/winner] Winner saved to DB with ID: ${savedWinner._id}`);


    return res.json({ success: true, winner: savedWinner });
  } catch (err) {
    console.error("[POST /api/winner] Error selecting winner:", err);
    res.status(500).json({ success: false, error: "Failed to select winner" });
  }
});

export default router;