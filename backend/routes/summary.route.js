import express from "express";
import EntryModel from "../models/Entry.model.js"; // Import the Entry model
import moment from "moment";
import crypto from "crypto"; // <<< ADD THIS IMPORT for decrypt/encrypt (if used here)
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// IMPORTANT: Ensure ENCRYPTION_KEY is set as a Vercel Environment Variable
// DO NOT HARDCODE THIS KEY IN PRODUCTION. This is for demonstration if not using process.env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
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
    if (typeof phoneNumber !== 'string') {
        return phoneNumber;
    }

    // Sanitize the input: remove spaces, dashes, parentheses.
    let cleanNumber = phoneNumber.replace(/[\s-()]/g, '');

    let prefix = '';
    let coreNumber = cleanNumber;

    // Handle +254 prefix
    if (cleanNumber.startsWith('+254')) {
        prefix = '+254';
        coreNumber = cleanNumber.substring(4);
    } 
    // Handle leading 0 (common for domestic calls in Kenya)
    else if (cleanNumber.startsWith('0') && cleanNumber.length > 1) {
        prefix = '0';
        coreNumber = cleanNumber.substring(1);
    }
    // If it's a 9-digit number without 0 or +254, treat it as is (e.g., 7XXXXXXXX)
    // If it's not starting with 254 or 0, we'll assume it's the core number directly.
    // This part requires careful consideration of expected input formats.

    // Minimum length for a meaningful mask (e.g., 3 masked + 2 at start + 2 at end)
    // For 9-digit core numbers, this allows 3 visible, 3 masked, 3 visible.
    // For 10-digit core numbers, this allows 3 visible, 3 masked, 4 visible.
    if (coreNumber.length < 7) { 
        return phoneNumber; // Too short to mask 3 digits in the center and show sufficient visible parts.
    }

    const maskedLength = 3;
    const remainingVisibleLength = coreNumber.length - maskedLength;

    // Calculate how many digits to show before the masked part
    const visibleStartLength = Math.floor(remainingVisibleLength / 2);
    // Calculate how many digits to show after the masked part
    const visibleEndLength = remainingVisibleLength - visibleStartLength;

    const maskedPart = '*'.repeat(maskedLength);

    const start = coreNumber.substring(0, visibleStartLength);
    const end = coreNumber.substring(coreNumber.length - visibleEndLength);

    // If there's no original prefix, just return the masked core number.
    // Otherwise, combine the original prefix with the masked core number.
    if (prefix === '') {
        return `${start}${maskedPart}${end}`;
    } else {
        // Reconstruct with the original prefix (e.g., +254 or 0)
        return `${prefix}${start}${maskedPart}${end}`;
    }
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