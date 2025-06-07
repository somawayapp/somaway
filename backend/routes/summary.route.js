import express from "express";
import PhoneModel from "../models/Phone.model.js";
import moment from "moment";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const total = 1_000_000;

    // Total amount collected
    const aggregation = await PhoneModel.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const current = aggregation[0]?.totalAmount || 0;

    // Get entries from the last 24 hours
    const since = moment().subtract(24, "hours").toDate();
    const recentCount = await PhoneModel.countDocuments({ createdAt: { $gte: since } });

    // Estimate time to reach full amount
    const remaining = total - current;
    const estimatedDays = recentCount > 0 ? Math.ceil((remaining / (recentCount * 1))) : "Unknown";

    // Get latest players (sorted by newest)
    const players = await PhoneModel.find({}, { name: 1, phone: 1 })
      .sort({ createdAt: -1 })
      .limit(1000000000)
      .lean();

    res.json({
      current,
      total,
      percentage: Math.round((current / total) * 100),
      estimatedTime: estimatedDays === "Unknown" ? "Unknown" : `${estimatedDays} day(s)`,
      players,
    });
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;