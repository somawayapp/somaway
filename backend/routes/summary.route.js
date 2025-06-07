import express from "express";
import PhoneModel from "../models/Phone.model.js";
import moment from "moment";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const total = 1_000_000;

    // Total amount collected so far
    const aggregation = await PhoneModel.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const current = aggregation[0]?.totalAmount || 0;

    // Get all entries from the last 24 hours sorted by time ascending
    const since = moment().subtract(24, "hours").toDate();
    const payments = await PhoneModel.find(
      { createdAt: { $gte: since } },
      { amount: 1, createdAt: 1 }
    ).sort({ createdAt: 1 }).lean();

    // Bucket payments into 12 intervals of 2 hours each
    const buckets = Array(12).fill(0); // 12 intervals * 2 hours = 24 hours
    const now = Date.now();

    payments.forEach(entry => {
      const hoursAgo = (now - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60); // hours ago
      const bucketIndex = Math.floor((24 - hoursAgo) / 2);
      if (bucketIndex >= 0 && bucketIndex < 12) {
        buckets[bucketIndex] += entry.amount;
      }
    });

    // Calculate average growth between buckets
    let totalGrowth = 0;
    let activePeriods = 0;

    for (let i = 1; i < buckets.length; i++) {
      const change = buckets[i] - buckets[i - 1];
      if (change !== 0) {
        totalGrowth += change;
        activePeriods++;
      }
    }

    const avgGrowthPerInterval = activePeriods ? totalGrowth / activePeriods : 0;
    const growthPerHour = avgGrowthPerInterval / 2; // since each interval is 2 hours

    // Estimate time to reach total based on current growth rate
    const remaining = total - current;
    const estimatedHours = growthPerHour > 0 ? Math.ceil(remaining / growthPerHour) : "Unknown";

    const estimatedTime =
      estimatedHours === "Unknown"
        ? "Unknown"
        : estimatedHours >= 24
        ? `${Math.floor(estimatedHours / 24)} day(s) ${estimatedHours % 24} hour(s)`
        : `${estimatedHours} hour(s)`;

    // Get latest players (sorted newest first)
    const players = await PhoneModel.find({}, { name: 1, phone: 1 })
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean();

    res.json({
      current,
      total,
      percentage: Math.round((current / total) * 100),
      estimatedTime,
      players,
    });
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;
