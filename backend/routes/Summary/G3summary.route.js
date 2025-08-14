import express from "express";
import G3entryModel from "../../models/Entries/G3entry.model.js";
import G3cycleModel from "../../models/Cycles/G3cycle.model.js"; // <<< Import the Cycle Model

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
  const totalGoalAmount = 1000; // Define your overall monetary goal here

  // 1. Total amount collected so far (ONLY for "Completed" transactions) for the specific cycle
  const aggregation = await G3entryModel.aggregate([
    { $match: { status: "Completed", cycle: cycleNumber } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
  ]);
  const currentAmountCollected = aggregation[0]?.totalAmount || 0;

  // 2. Get all "Completed" entries for the specific cycle, sorted by time ascending
  const paymentsForCycle = await G3entryModel.find(
    { status: "Completed", cycle: cycleNumber },
    { amount: 1, createdAt: 1 }
  ).sort({ createdAt: 1 }).lean();

      const now = moment();


  // 3. Determine Growth Rate and Estimated Time based on recent activity
  const remainingAmount = totalGoalAmount - currentAmountCollected;
  let estimatedTime = "Unknown";
  let growthRatePerSecond = 0; // Initialize growth rate in units per second

  // Only proceed with estimation if there's an amount remaining and payments exist
  if (remainingAmount > 0 && paymentsForCycle.length > 0) {

    // Strategy 1: Check very recent activity (e.g., last 5 minutes)
    const recentPayments = paymentsForCycle.filter(p =>
      moment(p.createdAt).isAfter(now.clone().subtract(5, 'minutes'))
    );

    if (recentPayments.length >= 2) {
      const firstPaymentTime = moment(recentPayments[0].createdAt);
      const lastPaymentTime = moment(recentPayments[recentPayments.length - 1].createdAt);
      const timeDiffSeconds = lastPaymentTime.diff(firstPaymentTime, 'seconds');
      const totalAmountRecent = recentPayments.reduce((sum, entry) => sum + entry.amount, 0);

      if (timeDiffSeconds > 0) {
        growthRatePerSecond = totalAmountRecent / timeDiffSeconds;
      }
    }

    // Strategy 2: If no rapid recent activity, look at the last hour
    if (growthRatePerSecond === 0) {
      const lastHourPayments = paymentsForCycle.filter(p =>
        moment(p.createdAt).isAfter(now.clone().subtract(1, 'hour'))
      );

      if (lastHourPayments.length >= 2) {
        const firstPaymentTime = moment(lastHourPayments[0].createdAt);
        const lastPaymentTime = moment(lastHourPayments[lastHourPayments.length - 1].createdAt);
        const timeDiffSeconds = lastPaymentTime.diff(firstPaymentTime, 'seconds');
        const totalAmountHour = lastHourPayments.reduce((sum, entry) => sum + entry.amount, 0);

        if (timeDiffSeconds > 0) {
          growthRatePerSecond = totalAmountHour / timeDiffSeconds;
        }
      }
    }

    // Strategy 3: If still no good rate, look at the last 24 hours
    if (growthRatePerSecond === 0) {
      const last24HourPayments = paymentsForCycle.filter(p =>
        moment(p.createdAt).isAfter(now.clone().subtract(24, 'hours'))
      );

      if (last24HourPayments.length >= 2) {
        const firstPaymentTime = moment(last24HourPayments[0].createdAt);
        const lastPaymentTime = moment(last24HourPayments[last24HourPayments.length - 1].createdAt);
        const timeDiffSeconds = lastPaymentTime.diff(firstPaymentTime, 'seconds');
        const totalAmount24Hours = last24HourPayments.reduce((sum, entry) => sum + entry.amount, 0);

        if (timeDiffSeconds > 0) {
          growthRatePerSecond = totalAmount24Hours / timeDiffSeconds;
        }
      } else if (last24HourPayments.length === 1 && paymentsForCycle.length > 1) {
          // If only one payment in last 24h, but multiple overall,
          // calculate rate from first payment in cycle to the last one in cycle.
          const firstPaymentOverall = paymentsForCycle[0];
          const lastPaymentOverall = paymentsForCycle[paymentsForCycle.length - 1];
          const timeDiffOverallSeconds = moment(lastPaymentOverall.createdAt).diff(moment(firstPaymentOverall.createdAt), 'seconds');
          const totalAmountOverall = paymentsForCycle.reduce((sum, entry) => sum + entry.amount, 0);

          if (timeDiffOverallSeconds > 0) {
              growthRatePerSecond = totalAmountOverall / timeDiffOverallSeconds;
          }
      }
    }

    // If no recent activity to base a rate on, consider if the goal is already met or if there's no progress
    if (currentAmountCollected >= totalGoalAmount) {
        estimatedTime = "Goal reached!";
        growthRatePerSecond = 0; // Reset rate if goal met
    } else if (growthRatePerSecond > 0) {
      const estimatedTotalSeconds = remainingAmount / growthRatePerSecond;

      if (estimatedTotalSeconds < 60) {
        estimatedTime = `${Math.ceil(estimatedTotalSeconds)} second(s)`;
      } else if (estimatedTotalSeconds < 3600) {
        estimatedTime = `${Math.ceil(estimatedTotalSeconds / 60)} minute(s)`;
      } else if (estimatedTotalSeconds < 86400) { // Less than 24 hours
        estimatedTime = `${Math.ceil(estimatedTotalSeconds / 3600)} hour(s)`;
      } else {
        const days = Math.floor(estimatedTotalSeconds / 86400);
        const hours = Math.ceil((estimatedTotalSeconds % 86400) / 3600);
        estimatedTime = `${days} day(s)`;
        if (hours > 0) {
          estimatedTime += ` ${hours} hour(s)`;
        }
      }
    } else {
        estimatedTime = "No recent activity to estimate";
    }
  } else if (currentAmountCollected >= totalGoalAmount) {
      estimatedTime = "Goal reached!";
  }


  // 4. Bucket payments into 12 intervals of 2 hours each (still based on last 24 hours for charting)
  const buckets = Array(12).fill(0);
  const nowTimestamp = Date.now();
  const paymentsLast24HoursForBucketing = paymentsForCycle.filter(p =>
    moment(p.createdAt).isAfter(now.clone().subtract(24, 'hours'))
  );

  paymentsLast24HoursForBucketing.forEach(entry => {
    const hoursAgo = (nowTimestamp - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60);
    const bucketIndex = Math.floor((24 - hoursAgo) / 2);
    if (bucketIndex >= 0 && bucketIndex < 12) {
      buckets[bucketIndex] += entry.amount;
    }
  });


  // 5. Get latest participants (ONLY for "Completed" transactions) for the specific cycle
  const players = await G3entryModel.find({ status: "Completed", cycle: cycleNumber }, { name: 1, phone: 1 })
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
    cycleNumber: cycleNumber, // Add the cycle number to the response
    players: decryptedPlayers,
    // You might want to include buckets data here if it's for the frontend chart
    // buckets: buckets,
  };
}

// API route to get the summary for the CURRENT active cycle
// Changed from "/:cycleNumber" to just "/" to imply getting the current cycle
router.get("/", async (req, res) => {
  try {
    // 1. Find the current active cycle number
    // Assuming the "current" cycle is the one with the highest 'number'
    const currentCycle = await G3cycleModel.findOne().sort({ number: -1 }).lean();

    if (!currentCycle) {
      // If no cycle exists, you might want to default to cycle 1 or return an error
      return res.status(404).json({ error: "No active cycle found. Please create a cycle first." });
    }

    const cycleNumber = currentCycle.number;

    console.log(`Fetching live summary data for current cycle: ${cycleNumber}...`);
    const summaryData = await fetchSummaryData(cycleNumber);
    console.log(`Summary data fetched for cycle: ${cycleNumber}.`);

    res.json(summaryData);
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// If you still want an endpoint to get summary for a *specific* cycle number,
// you can keep this route alongside the one above:
router.get("/", async (req, res) => {
  try {
    const cycleNumber = parseInt(req.params.cycleNumber, 10);
    if (isNaN(cycleNumber)) {
      return res.status(400).json({ error: "Invalid cycle number provided." });
    }

    console.log(`Fetching live summary data for specific cycle: ${cycleNumber}...`);
    const summaryData = await fetchSummaryData(cycleNumber);
    console.log(`Summary data fetched for cycle: ${cycleNumber}.`);

    res.json(summaryData);
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;