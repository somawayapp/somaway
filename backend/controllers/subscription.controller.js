import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const updateSubscriptionFromPayment = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const { plan, price } = req.body;
    if (!plan || !price) return res.status(400).json({ message: "Plan and price are required." });

    // Send response immediately to prevent delay
    res.status(200).json({ message: "Subscription update in progress." });

    // Find user and handle subscription in the background
    const user = await User.findOne({ clerkUserId }).lean();
    if (!user) return;

    const duration = plan === "monthly" ? 30 : 365;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    await Subscription.updateOne(
      { user: user._id },
      { $set: { plan, price, startDate, endDate, status: "active", isActive: true } },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
};
