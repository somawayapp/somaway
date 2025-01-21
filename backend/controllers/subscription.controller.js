import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const updateSubscriptionFromPayment = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const { plan, price } = req.body;

    if (!plan || !price) {
      return res.status(400).json({ message: "Plan and price are required." });
    }

    const user = await User.findOne({ clerkUserId }).lean();
    if (!user) {
      return res.status(404).json("User not found!");
    }

    const duration = plan === "monthly" ? 30 : 365;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    // Queue response before handling database operation
    res.status(200).json({ message: "Subscription update queued." });

    await Subscription.findOneAndUpdate(
      { user: user._id },
      { plan, price, startDate, endDate, status: "active", isActive: true },
      { new: true, upsert: true }
    );
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json("Internal server error!");
    }
  }
};
