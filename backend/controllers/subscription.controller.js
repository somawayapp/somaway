import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const updateSubscriptionFromPayment = async (req, res) => {
    try {
      console.log("Request Headers:", req.headers);
  
      const clerkUserId = req.auth?.userId; // Access Clerk user ID from the request object
  
      // Ensure the user is authenticated
      if (!clerkUserId) {
        console.log("Not authenticated, returning 401.");
        return res.status(401).json("Not authenticated!");
      }
  
      console.log("Authenticated Clerk User ID:", clerkUserId);
  
      const { plan, price } = req.body;
  
      // Validate the incoming request data
      if (!plan || !price) {
        console.error("Plan or price is missing from the request body.");
        return res.status(400).json({ message: "Plan and price are required." });
      }
  
      console.log("Plan selected:", plan, "Price:", price);
  
      // Find the user in the database
      const user = await User.findOne({ clerkUserId });
      if (!user) {
        console.log("User not found, returning 404.");
        return res.status(404).json("User not found!");
      }
  
      console.log("Found user:", user);
  
      // Calculate the subscription period
      const duration = plan === "monthly" ? 30 : 365; // 30 days for monthly, 365 for annual
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add days to current time
  
      // Update or create the subscription
      console.log("Updating subscription for user:", user._id);
      await Subscription.findOneAndUpdate(
        { user: user._id },
        {
          plan,
          price,
          startDate,
          endDate,
          status: "active",
          isActive: true,
        },
        { new: true, upsert: true } // Ensure subscription creation if it doesn't exist
      );
  
      console.log("Subscription updated successfully.");
      res.status(200).json({ message: "Subscription updated successfully from PayPal." });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json("Internal server error!");
    }
  };
  
  