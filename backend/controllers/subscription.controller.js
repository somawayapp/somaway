import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";

export const updateSubscription = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const { plan, startDate } = req.body;

  if (!clerkUserId) {
    return res.status(401).json({ message: "User is not authenticated." });
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const duration = plan === 'monthly' ? 30 : 365; // Days
  const endDate = new Date(new Date(startDate).getTime() + duration * 24 * 60 * 60 * 1000);

  // Using Subscription model to update subscription details
  await Subscription.findOneAndUpdate(
    { user: user._id },
    {
      plan,
      startDate,
      endDate,
      status: 'active',
      isActive: true,
    },
    { new: true, upsert: true }
  );

  res.status(200).json({ message: "Subscription updated successfully." });
};

export const getSubscriptionDetails = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json({ message: "User is not authenticated." });
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const subscription = await Subscription.findOne({ user: user._id });

  if (!subscription) {
    return res.status(404).json({ message: "Subscription details not found." });
  }

  res.status(200).json(subscription);
};
