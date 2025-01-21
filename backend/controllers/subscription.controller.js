import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const updateSubscriptionFromPayment = async (req, res) => {
  const { plan, price } = req.body;
  const clerkUserId = req.auth.userId; // Assumes Clerk is used for authentication.

  if (!clerkUserId) {
    return res.status(401).json({ message: "User is not authenticated." });
  }

  // Find the user based on the authenticated userId (Clerk)
  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Calculate the start and end dates based on the plan
  const duration = plan === 'monthly' ? 30 : 365; // 30 days for monthly, 365 for annual
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add days to current time

  try {
    // Create or update the subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan,
        price,
        startDate,
        endDate,
        status: 'active',
        isActive: true,
      },
      { new: true, upsert: true } // Ensure that the subscription is created if it doesn't exist
    );

    res.status(200).json({ message: "Subscription updated successfully from PayPal." });
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ message: 'Failed to update subscription.' });
  }
};
