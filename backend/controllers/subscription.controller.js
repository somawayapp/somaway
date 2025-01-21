import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const updateSubscriptionFromPayment = async (req, res) => {
  const { plan, price, orderId } = req.body;
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json({ message: "User is not authenticated." });
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Calculate subscription duration and end date
  const duration = plan === 'monthly' ? 30 : 365; // Days
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

  try {
    // Update or create subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan,
        price,
        orderId,
        startDate,
        endDate,
        status: 'active',
        isActive: true,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Subscription updated successfully from PayPal." });
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ message: 'Failed to update subscription.' });
  }
};
