// routes/summary.router.js
import express from "express";
import EntryModel from "../models/Entry.model.js"; // Import the Entry model
import moment from "moment";
import crypto from "crypto";

const router = express.Router();

// IMPORTANT: Ensure ENCRYPTION_KEY is set as a Vercel Environment Variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Use process.env directly, remove fallback for production
const IV_LENGTH = 16; // For AES-256-CBC

// --- Helper Functions for Decryption ---
function decrypt(text) {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set. Cannot decrypt.");
  }
  const textParts = text.split(":");
  if (textParts.length !== 2) {
      throw new Error("Invalid encrypted text format.");
  }
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// --- Helper for Phone Number Masking (Already exists, but ensuring it's here) ---
function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length < 5) {
    return "********"; // Return masked if invalid or too short
  }
  const len = phoneNumber.length;
  // Show first 5 digits, then stars, then last 3 digits
  // Example: 254712345678 -> 25471****078
  const firstPart = phoneNumber.substring(0, 5);
  const lastPart = phoneNumber.substring(len - 3);
  const stars = '*'.repeat(Math.max(0, len - 5 - 3)); // Ensure non-negative count of stars
  return `${firstPart}${stars}${lastPart}`;
}


// In-memory cache
let cache = null;
let lastUpdated = 0;
const CACHE_TTL = 60 * 1000; // 1 minute in milliseconds

async function fetchSummaryData() {
  const totalGoalAmount = 1_000_000;

  // 1. Total amount collected so far (ONLY for "Completed" transactions)
  const aggregation = await EntryModel.aggregate([
    { $match: { status: "Completed" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
  ]);
  const currentAmountCollected = aggregation[0]?.totalAmount || 0;

  // 2. Get all "Completed" entries from the last 24 hours sorted by time ascending
  const since = moment().subtract(24, "hours").toDate();
  const paymentsLast24Hours = await EntryModel.find(
    { status: "Completed", createdAt: { $gte: since } },
    { amount: 1, createdAt: 1 }
  ).sort({ createdAt: 1 }).lean();

  // 3. Bucket payments into 12 intervals of 2 hours each
  const buckets = Array(12).fill(0);
  const nowTimestamp = Date.now();

  paymentsLast24Hours.forEach(entry => {
    const hoursAgo = (nowTimestamp - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60);
    const bucketIndex = Math.floor((24 - hoursAgo) / 2);
    if (bucketIndex >= 0 && bucketIndex < 12) {
      buckets[bucketIndex] += entry.amount;
    }
  });

  // 4. Calculate growth rate for estimation
  const totalCollectedInLast24Hours = paymentsLast24Hours.reduce((sum, entry) => sum + entry.amount, 0);
  const growthRatePerHour = totalCollectedInLast24Hours / 24;

  // 5. Estimate time to reach goal
  const remainingAmount = totalGoalAmount - currentAmountCollected;
  let estimatedHours = "Unknown";
  let estimatedTime = "Unknown";

  if (growthRatePerHour > 0) {
    estimatedHours = Math.ceil(remainingAmount / growthRatePerHour);
    if (estimatedHours < 0) estimatedHours = 0;

    if (estimatedHours === 0) {
        estimatedTime = "Goal reached!";
    } else if (estimatedHours < 24) {
        estimatedTime = `${estimatedHours} hour(s)`;
    } else {
        const days = Math.floor(estimatedHours / 24);
        const hours = estimatedHours % 24;
        estimatedTime = `${days} day(s) ${hours} hour(s)`;
    }
  }

  // 6. Get latest participants (ONLY for "Completed" transactions) and Decrypt their data
  const players = await EntryModel.find({ status: "Completed" }, { name: 1, phone: 1 })
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean();

  // Decrypt name and phone for each player, AND APPLY MASKING
  const decryptedPlayers = players.map(player => {
    let decryptedName = "Error";
    let decryptedPhone = "Error";
    try {
      decryptedName = decrypt(player.name);
    } catch (e) {
      console.error(`Error decrypting player name for ID ${player._id}:`, e.message);
    }
    try {
      let fullPhoneNumber = decrypt(player.phone); // First decrypt to get full number
      decryptedPhone = maskPhoneNumber(fullPhoneNumber); // THEN mask it for display
    } catch (e) {
      console.error(`Error decrypting player phone for ID ${player._id}:`, e.message);
    }
    return {
      _id: player._id,
      name: decryptedName,
      phone: decryptedPhone, // This will now be masked
      createdAt: player.createdAt
    };
  });

  return {
    current: currentAmountCollected,
    total: totalGoalAmount,
    percentage: Math.round((currentAmountCollected / totalGoalAmount) * 100),
    estimatedTime,
    players: decryptedPlayers, // Use decrypted (and now masked) players
  };
}

// API route with caching
router.get("/", async (req, res) => {
  try {
    const now = Date.now();
    if (!cache || now - lastUpdated > CACHE_TTL) {
      console.log("Fetching new summary data (cache expired or not set)...");
      cache = await fetchSummaryData();
      lastUpdated = now;
      console.log("Summary data fetched and cached.");
    } else {
      console.log("Serving summary data from cache.");
    }

    res.json(cache);
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;