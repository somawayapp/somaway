import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';
import { Clerk } from '@clerk/clerk-sdk-node'; // Ensure Clerk SDK is imported for verification

// Middleware to authenticate user from Clerk token
export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    console.error('Authorization token is missing.');
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  try {
    // Verify the token with Clerk
    console.log('Verifying Clerk token:', token);
    const user = await Clerk.verifySession(token);

    // Attach the user to the request object for further use
    req.auth = { userId: user.id };
    console.log('Authenticated user:', user);
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Unauthorized.' });
  }
};

// Update subscription based on payment data
export const updateSubscriptionFromPayment = async (req, res) => {
  const { plan, price } = req.body;
  const clerkUserId = req.auth.userId; // Clerk user ID from the authentication middleware

  if (!clerkUserId) {
    console.error('User not authenticated, missing Clerk user ID.');
    return res.status(401).json({ message: "User is not authenticated." });
  }

  console.log('Plan selected:', plan, 'Price:', price);

  // Find the user based on the authenticated userId (Clerk)
  const user = await User.findOne({ clerkUserId });

  if (!user) {
    console.error('User not found for Clerk ID:', clerkUserId);
    return res.status(404).json({ message: "User not found." });
  }

  // Calculate the start and end dates based on the plan
  const duration = plan === 'monthly' ? 30 : 365; // 30 days for monthly, 365 for annual
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add days to current time

  try {
    // Create or update the subscription
    console.log('Updating subscription for user:', user._id);
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

    console.log('Subscription updated successfully.');
    res.status(200).json({ message: "Subscription updated successfully from PayPal." });
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ message: 'Failed to update subscription.' });
  }
};
