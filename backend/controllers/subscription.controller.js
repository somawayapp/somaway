export const updateSubscriptionFromPayment = async (req, res) => {
    try {
      // Extract user ID from the authentication middleware
      const clerkUserId = req.auth?.userId;
  
      // Check if the user is authenticated
      if (!clerkUserId) {
        console.error("User not authenticated, missing Clerk user ID.");
        return res.status(401).json({ message: "User is not authenticated!" });
      }
  
      // Log the received subscription details
      const { plan, price } = req.body;
      console.log("Received plan and price:", { plan, price });
  
      // Verify the provided plan
      if (!["monthly", "annual"].includes(plan)) {
        return res.status(400).json({ message: "Invalid subscription plan." });
      }
  
      // Calculate the subscription duration
      const duration = plan === "monthly" ? 30 : 365; // Days for each plan
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
  
      // Find the user based on the authenticated Clerk user ID
      const user = await User.findOne({ clerkUserId });
      if (!user) {
        console.error("User not found for Clerk ID:", clerkUserId);
        return res.status(404).json({ message: "User not found!" });
      }
  
      // Update or create the subscription
      console.log("Updating subscription for user ID:", user._id);
      const updatedSubscription = await Subscription.findOneAndUpdate(
        { user: user._id },
        {
          plan,
          price,
          startDate,
          endDate,
          status: "active",
          isActive: true,
        },
        { new: true, upsert: true } // Create if it doesn't exist
      );
  
      console.log("Subscription updated successfully:", updatedSubscription);
      res.status(200).json({ message: "Subscription updated successfully." });
    } catch (err) {
      console.error("Error updating subscription:", err);
      res.status(500).json({ message: "Failed to update subscription." });
    }
  };
  