import express from "express";
import PhoneModel from "../models/Phone.model.js";
import moment from "moment";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const total = 1_000_000;

    // Current total amount
    const aggregation = await PhoneModel.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const current = aggregation[0]?.totalAmount || 0;

    const now = moment();
    const since = moment().subtract(24, "hours");

    // Group by hour within the last 24 hours
    const hourlyData = await PhoneModel.aggregate([
      {
        $match: {
          createdAt: { $gte: since.toDate(), $lte: now.toDate() },
        },
      },
      {
        $group: {
          _id: {
            hour: { $hour: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          hourlySum: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
          "_id.hour": 1,
        },
      },
    ]);

    // Use the last few hours (e.g. 6) to estimate current trend
    const recentHours = hourlyData.slice(-6);
    const averagePerHour =
      recentHours.reduce((sum, hr) => sum + hr.hourlySum, 0) /
      (recentHours.length || 1);

    const remaining = total - current;
    const estimatedHours = averagePerHour > 0
      ? Math.ceil(remaining / averagePerHour)
      : "Unknown";

    const players = await PhoneModel.find({}, { name: 1, phone: 1 })
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean();

    res.json({
      current,
      total,
      percentage: Math.round((current / total) * 100),
      estimatedTime: estimatedHours === "Unknown" ? "Unknown" : `${estimatedHours} hour(s)`,
      hourlyRate: averagePerHour.toFixed(2),
      players,
    });
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;
