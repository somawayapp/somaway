// routes/winner.route.js
import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import EntryModel from '../models/Entry.model.js';
import WinnerModel from '../models/Winner.model.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;
const MAX_PARTICIPANTS = 1000000; // Match this with your mpesa.route.js
const WINNER_AMOUNT = 1000000; // 1 Million KES prize

// --- Helper Functions for Encryption (Copy from mpesa.route.js or create a utils file) ---
function decrypt(text) {
  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null; // Return null on decryption failure
  }
}

// Function to fetch a public random seed (e.g., a future Bitcoin block hash)
// IMPORTANT: For production, you'd want to fetch a FUTURE block hash AFTER the cycle completes
// to ensure it can't be manipulated. For a demo, we can fetch a recent one.
// You might need to use a reliable Bitcoin API (e.g., BlockCypher, Blockchain.com API)
// This example uses a placeholder.
async function getPublicRandomSeed() {
  try {
    // Example using Blockstream.info for latest block hash (simple, but consider rate limits/reliability)
    // For a future block, you'd need a more advanced API that allows waiting for a specific block height.
    const response = await axios.get('https://blockstream.info/api/blocks/tip/hash');
    const blockHash = response.data;
    console.log("Fetched public random seed (Bitcoin block hash):", blockHash);
    return blockHash;
  } catch (error) {
    console.error("Failed to fetch public random seed (Bitcoin block hash):", error.message);
    // Fallback or throw an error to prevent winner selection without a seed
    return "fallback_random_seed_if_api_fails_in_dev_1234567890abcdef"; // Use a strong fallback for testing
  }
}

// --- WINNER SELECTION LOGIC ---
// This function will be called externally (e.g., by a cron job or after a transaction)
async function selectWinner(cycleNumber) {
  // Prevent re-selection for the same cycle
  const existingWinner = await WinnerModel.findOne({ cycle: cycleNumber });
  if (existingWinner) {
    console.log(`Winner already selected for cycle ${cycleNumber}. Skipping.`);
    return existingWinner; // Return existing winner
  }

  // Ensure the cycle has met the criteria
  const totalParticipants = await EntryModel.countDocuments({
    status: "Completed",
    cycle: cycleNumber,
  });
  const totalAmountConfirmed = (
    await EntryModel.aggregate([
      { $match: { status: "Completed", cycle: cycleNumber } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
  )[0]?.total || 0;

  if (totalParticipants < MAX_PARTICIPANTS || totalAmountConfirmed < MAX_PARTICIPANTS) {
    console.log(`Cycle ${cycleNumber} has not reached the million mark yet. Participants: ${totalParticipants}, Amount: ${totalAmountConfirmed}`);
    throw new Error(`Cycle ${cycleNumber} not yet complete. Cannot select winner.`);
  }

  console.log(`Cycle ${cycleNumber} has reached the million mark! Initiating winner selection.`);

  // Step 1: Get public randomness (e.g., latest Bitcoin block hash)
  const publicRandomSeed = await getPublicRandomSeed();
  if (!publicRandomSeed) {
    throw new Error("Could not obtain a public random seed for winner selection.");
  }

  // Step 2: Fetch all completed participants for the cycle
  // Crucially, sort them by _id or createdAt to ensure deterministic order
  const participants = await EntryModel.find({
    status: "Completed",
    cycle: cycleNumber,
  }).sort({ createdAt: 1, _id: 1 }).select('phoneHash name phone createdAt'); // Select relevant fields

  if (participants.length === 0) {
    throw new Error(`No completed participants found for cycle ${cycleNumber}.`);
  }

  // Step 3: Build a list of hashes from your participants
  // Use _id (which includes timestamp) and phoneHash for stronger uniqueness
  const participantHashes = participants.map((entry, index) => {
    // Combine index and a consistent identifier for each entry
    return crypto.createHash("sha256").update(`${index}-${entry._id.toHexString()}-${entry.phoneHash}`).digest("hex");
  });

  // Step 4: Combine with public seed to find winner
  const combinedHashes = participantHashes.map(h =>
    crypto.createHash("sha256").update(publicRandomSeed + h).digest("hex")
  );

  // Step 5: Convert each to number and find smallest
  // Using a larger slice (e.g., 16 or 32 chars) for higher entropy if needed
  // But 8 chars (32 bits) is usually sufficient for 1 million entries
  const scores = combinedHashes.map(h => parseInt(h.slice(0, 8), 16)); // Convert first 8 hex chars to integer

  const minScore = Math.min(...scores);
  const winnerIndex = scores.indexOf(minScore); // Find first occurrence of the minimum score

  // Handle potential ties by picking the one with the smallest original _id or createdAt if scores are identical
  // For most cryptographic hashes, collisions are extremely rare, so indexOf should be sufficient.
  // If there's a true tie in score (which is unlikely with good hashing and sufficient bits),
  // the first one in the sorted `participants` array wins.

  const winnerEntry = participants[winnerIndex];

  // Store the winner details
  const newWinner = await WinnerModel.create({
    cycle: cycleNumber,
    winnerEntryId: winnerEntry._id,
    winnerNameEncrypted: winnerEntry.name, // Storing encrypted, decrypt on demand
    winnerPhoneEncrypted: winnerEntry.phone, // Storing encrypted, decrypt on demand
    amountWon: WINNER_AMOUNT,
    publicRandomSeed: publicRandomSeed,
    participantsSnapshot: participants.map(p => ({
      _id: p._id,
      phoneHash: p.phoneHash,
      createdAt: p.createdAt // Store for auditability
    })),
    winningHash: combinedHashes[winnerIndex],
    winningScore: scores[winnerIndex],
  });

  console.log(`Winner for cycle ${cycleNumber} selected: ${decrypt(winnerEntry.name)} (ID: ${winnerEntry._id})`);
  return newWinner;
}

// --- API Endpoints ---

// Endpoint to manually trigger winner selection (for testing/admin)
// In production, this should ideally be triggered by a robust scheduled job or internal event.
router.post('/select/:cycleNumber', async (req, res) => {
  const { cycleNumber } = req.params;
  const currentCycle = parseInt(cycleNumber, 10);

  if (isNaN(currentCycle)) {
    return res.status(400).json({ success: false, error: 'Invalid cycle number.' });
  }

  // Basic authentication for this sensitive endpoint (e.g., API key, admin login)
  // For production, this is critical!
  if (req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) { // Define ADMIN_API_KEY in .env
    return res.status(403).json({ success: false, error: 'Unauthorized.' });
  }

  try {
    const winner = await selectWinner(currentCycle);
    res.json({ success: true, message: `Winner selected for cycle ${currentCycle}.`, winner });
  } catch (error) {
    console.error(`Error selecting winner for cycle ${currentCycle}:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to get winner details for a specific cycle
router.get('/:cycleNumber', async (req, res) => {
  const { cycleNumber } = req.params;
  const currentCycle = parseInt(cycleNumber, 10);

  if (isNaN(currentCycle)) {
    return res.status(400).json({ success: false, error: 'Invalid cycle number.' });
  }

  try {
    const winner = await WinnerModel.findOne({ cycle: currentCycle }).populate('winnerEntryId');

    if (!winner) {
      return res.status(404).json({ success: false, error: `No winner found for cycle ${currentCycle} yet.` });
    }

    // Decrypt winner's name and phone for display (or partially display)
    const decryptedName = decrypt(winner.winnerNameEncrypted);
    // You might choose not to display the full phone number for privacy on the frontend
    const decryptedPhone = decrypt(winner.winnerPhoneEncrypted);

    res.json({
      success: true,
      winner: {
        cycle: winner.cycle,
        name: decryptedName, // Decrypted name for display
        phonePartial: decryptedPhone ? `...${decryptedPhone.slice(-4)}` : 'N/A', // Last 4 digits
        amountWon: winner.amountWon,
        selectionTimestamp: winner.selectionTimestamp,
        publicRandomSeed: winner.publicRandomSeed, // For auditability on frontend
        // Optionally provide a way to verify:
        // winningHash: winner.winningHash,
        // winningScore: winner.winningScore,
      }
    });
  } catch (error) {
    console.error(`Error fetching winner for cycle ${currentCycle}:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch winner details.' });
  }
});

// Endpoint for auditability: allows re-calculating winner given a snapshot and seed
// This should be an ADMIN-only endpoint
router.post('/verify-selection', async (req, res) => {
  const { publicRandomSeed, participantsSnapshot, cycle, winningHash, winningScore } = req.body;

  if (!publicRandomSeed || !participantsSnapshot || !Array.isArray(participantsSnapshot) || !cycle) {
    return res.status(400).json({ success: false, error: 'Missing required audit parameters.' });
  }

  // Basic authentication for this sensitive endpoint
  if (req.headers['x-admin-key'] !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ success: false, error: 'Unauthorized.' });
  }

  try {
    const reCalculatedParticipantHashes = participantsSnapshot.map((p, index) => {
      return crypto.createHash("sha256").update(`${index}-${p._id}-${p.phoneHash}`).digest("hex");
    });

    const reCalculatedCombinedHashes = reCalculatedParticipantHashes.map(h =>
      crypto.createHash("sha256").update(publicRandomSeed + h).digest("hex")
    );

    const reCalculatedScores = reCalculatedCombinedHashes.map(h => parseInt(h.slice(0, 8), 16));

    const minScore = Math.min(...reCalculatedScores);
    const winnerIndex = reCalculatedScores.indexOf(minScore);

    const reCalculatedWinningEntry = participantsSnapshot[winnerIndex];

    const isWinnerCorrect = (reCalculatedWinningEntry._id === req.body.winnerEntryId) &&
                            (reCalculatedScores[winnerIndex] === winningScore) &&
                            (reCalculatedCombinedHashes[winnerIndex] === winningHash);


    res.json({
      success: true,
      message: "Audit complete.",
      isWinnerCorrect: isWinnerCorrect,
      reCalculatedWinnerIndex: winnerIndex,
      reCalculatedWinnerId: reCalculatedWinningEntry._id,
      reCalculatedWinningHash: reCalculatedCombinedHashes[winnerIndex],
      reCalculatedWinningScore: reCalculatedScores[winnerIndex],
      providedWinnerId: req.body.winnerEntryId, // Compare against this
      // Optionally return more details for deeper audit
    });

  } catch (error) {
    console.error("Error during winner verification:", error.message);
    res.status(500).json({ success: false, error: 'Failed to verify selection: ' + error.message });
  }
});


export default router;
