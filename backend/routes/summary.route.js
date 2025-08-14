import express from "express";
import G1entryModel from "../models/Entries/G1entry.model.js";

import moment from "moment";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

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

  let cleanNumber = phoneNumber.replace(/[\s-()]/g, '');

  let prefix = '';
  let coreNumber = cleanNumber;

  if (cleanNumber.startsWith('+254')) {
    prefix = '+254';
    coreNumber = cleanNumber.substring(4);
  } else if (cleanNumber.startsWith('0') && cleanNumber.length > 1) {
    prefix = '0';
    coreNumber = cleanNumber.substring(1);
  }

  if (coreNumber.length < 7) {
    return phoneNumber;
  }

  const maskedLength = 3;
  const remainingVisibleLength = coreNumber.length - maskedLength;

  const visibleStartLength = Math.floor(remainingVisibleLength / 2);
  const visibleEndLength = remainingVisibleLength - visibleStartLength;

  const maskedPart = '*'.repeat(maskedLength);

  const start = coreNumber.substring(0, visibleStartLength);
  const end = coreNumber.substring(coreNumber.length - visibleEndLength);

  if (prefix === '') {
    return `${start}${maskedPart}${end}`;
  } else {
    return `${prefix}${start}${maskedPart}${end}`;
  }
}

async function fetchSummaryData(cycleNumber) {
  const totalGoalAmount = 10; // Define your overall monetary goal here

  // 1. Total amount collected so far (ONLY for "Completed" transactions) for the specific cycle
  const aggregation = await G1entryModel.aggregate([
    { $match: { status: "Completed", cycle: cycleNumber } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
  ]);
  const currentAmountCollected = aggregation[0]?.totalAmount || 0;

  // 2. Get all "Completed" entries for the specific cycle from the last 24 hours sorted by time ascending
  const since = moment().subtract(24, "hours").toDate();
  const paymentsLast24Hours = await G1entryModel.find(
    { status: "Completed", cycle: cycleNumber, createdAt: { $gte: since } },
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
  let estimatedTime = "Unknown";

  if (growthRatePerHour > 0) {
    const estimatedHours = remainingAmount / growthRatePerHour;
    if (estimatedHours <= 0) {
      estimatedTime = "Goal reached!";
    } else {
      const totalSeconds = estimatedHours * 3600;

      if (totalSeconds < 60) {
        estimatedTime = `${Math.ceil(totalSeconds)} second(s)`;
      } else if (totalSeconds < 3600) {
        estimatedTime = `${Math.ceil(totalSeconds / 60)} minute(s)`;
      } else if (totalSeconds < 86400) { // Less than 24 hours
        estimatedTime = `${Math.ceil(totalSeconds / 3600)} hour(s)`;
      } else {
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.ceil((totalSeconds % 86400) / 3600);
        estimatedTime = `${days} day(s)`;
        if (hours > 0) {
          estimatedTime += ` ${hours} hour(s)`;
        }
      }
    }
  }

  // 6. Get latest participants (ONLY for "Completed" transactions) for the specific cycle
  const players = await G1entryModel.find({ status: "Completed", cycle: cycleNumber }, { name: 1, phone: 1 })
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean();

  const decryptedPlayers = players.map(player => {
    let decryptedName = "Error";
    let decryptedPhone = "Error";
    let maskedPhone = "Error";

    try {
      decryptedName = decrypt(player.name);
    } catch (e) {
      console.error(`Error decrypting player name for ID ${player._id}:`, e.message);
    }
    try {
      decryptedPhone = decrypt(player.phone);
      maskedPhone = maskPhoneNumber(decryptedPhone);
    } catch (e) {
      console.error(`Error decrypting player phone for ID ${player._id}:`, e.message);
    }
    return {
      _id: player._id,
      name: decryptedName,
      phone: maskedPhone,
      createdAt: player.createdAt
    };
  });

  return {
    current: currentAmountCollected,
    total: totalGoalAmount,
    percentage: Math.round((currentAmountCollected / totalGoalAmount) * 100),
    estimatedTime,
    players: decryptedPlayers,
  };
}

// API route without caching, fetching based on cycle number
router.get("/:cycleNumber", async (req, res) => {
  try {
    const cycleNumber = parseInt(req.params.cycleNumber, 10);
    if (isNaN(cycleNumber)) {
      return res.status(400).json({ error: "Invalid cycle number provided." });
    }

    console.log(`Fetching live summary data for cycle: ${cycleNumber}...`);
    const summaryData = await fetchSummaryData(cycleNumber);
    console.log(`Summary data fetched for cycle: ${cycleNumber}.`);

    res.json(summaryData);
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;