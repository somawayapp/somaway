import express from "express";
import EntryModel from "../models/Entry.model.js"; // Import the Entry model
import moment from "moment";
import crypto from "crypto"; // <<< ADD THIS IMPORT for decrypt/encrypt (if used here)

const router = express.Router();

// IMPORTANT: Ensure ENCRYPTION_KEY is set as a Vercel Environment Variable
// DO NOT HARDCODE THIS KEY IN PRODUCTION. This is for demonstration if not using process.env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "8ab21ec1dd828cc6409d0ed55b876e0530dfbccd67e56f1318e684e555896f3d"; // FALLBACK for testing, but process.env is preferred
const IV_LENGTH = 16; // For AES-256-CBC

// --- Helper Functions for Decryption (Assuming ENCRYPTION_KEY is available) ---
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

// Function to mask phone numbers
function maskPhoneNumber(phoneNumber) {
    if (typeof phoneNumber !== 'string' || phoneNumber.length < 4) {
        return phoneNumber; // Return as is if not a valid string or too short to mask
    }
    // Keep first 3 digits, mask the middle, keep last 2 digits
    const firstPart = phoneNumber.substring(0, 5);
    const lastPart = phoneNumber.substring(phoneNumber.length - 5);
    const maskedPart = '*'.repeat(phoneNumber.length - 5); // Mask the rest
    return `${firstPart}${maskedPart}${lastPart}`;
}


// In-memory cache
let cache = null;
let lastUpdated = 0;
const CACHE_TTL = 60 * 1000; // 1 minute in milliseconds

async function fetchSummaryData() {
  const totalGoalAmount = 1_000_000; // Define your overall monetary goal here

  // 1. Total amount collected so far (ONLY for "Completed" transactions)
  const aggregation = await EntryModel.aggregate([
    { $match: { status: "Completed" } }, // <<< Filter only completed
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
  ]);
  const currentAmountCollected = aggregation[0]?.totalAmount || 0;

  // 2. Get all "Completed" entries from the last 24 hours sorted by time ascending
  const since = moment().subtract(24, "hours").toDate();
  const paymentsLast24Hours = await EntryModel.find(
    { status: "Completed", createdAt: { $gte: since } }, // <<< Filter only completed
    { amount: 1, createdAt: 1 }
  ).sort({ createdAt: 1 }).lean();

  // 3. Bucket payments into 12 intervals of 2 hours each
  const buckets = Array(12).fill(0); // 12 intervals * 2 hours = 24 hours
  const nowTimestamp = Date.now(); // Milliseconds since epoch

  paymentsLast24Hours.forEach(entry => {
    // Calculate hours ago relative to 'nowTimestamp'
    const hoursAgo = (nowTimestamp - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60);
    // Determine bucket index: (24 - hoursAgo) gives hours until 'now', divide by 2 for 2-hour buckets
    const bucketIndex = Math.floor((24 - hoursAgo) / 2);
    if (bucketIndex >= 0 && bucketIndex < 12) {
      buckets[bucketIndex] += entry.amount;
    }
  });

  // 4. Calculate growth rate for estimation
  // A simpler approach: total collected in last 24 hours
  const totalCollectedInLast24Hours = paymentsLast24Hours.reduce((sum, entry) => sum + entry.amount, 0);
  const growthRatePerHour = totalCollectedInLast24Hours / 24; // Average growth over last 24 hours

  // 5. Estimate time to reach goal
  const remainingAmount = totalGoalAmount - currentAmountCollected;
  let estimatedHours = "Unknown";
  let estimatedTime = "Unknown";

  if (growthRatePerHour > 0) {
    estimatedHours = Math.ceil(remainingAmount / growthRatePerHour);
    if (estimatedHours < 0) estimatedHours = 0; // If goal already reached

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
  const players = await EntryModel.find({ status: "Completed" }, { name: 1, phone: 1 }) // <<< Filter only completed
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean(); // .lean() makes it plain JavaScript objects, faster for processing

  // Decrypt name and phone for each player and then mask the phone number
  const decryptedPlayers = players.map(player => {
    let decryptedName = "Error";
    let decryptedPhone = "Error";
    let maskedPhone = "Error"; // Initialize masked phone

    try {
      decryptedName = decrypt(player.name);
    } catch (e) {
      console.error(`Error decrypting player name for ID ${player._id}:`, e.message);
    }
    try {
      decryptedPhone = decrypt(player.phone);
      maskedPhone = maskPhoneNumber(decryptedPhone); // Mask the decrypted phone number
    } catch (e) {
      console.error(`Error decrypting player phone for ID ${player._id}:`, e.message);
    }
    return {
      _id: player._id,
      name: decryptedName,
      phone: maskedPhone, // <<< Use masked phone
      createdAt: player.createdAt // Keep original creation time
    };
  });


  return {
    current: currentAmountCollected,
    total: totalGoalAmount,
    percentage: Math.round((currentAmountCollected / totalGoalAmount) * 100),
    estimatedTime,
    players: decryptedPlayers, // <<< Use decrypted and masked players
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