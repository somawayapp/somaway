import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';

export const verifyPayment = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const { plan, price, orderId } = req.body;
    if (!plan || !price || !orderId) {
      return res.status(400).json({ message: "Plan, price, and order ID are required." });
    }

    // Respond immediately to the client
    res.status(200).json({ message: "Payment verification in progress." });

    // Verify payment with PayPal API
    const paypalResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
    });
    const paymentDetails = await paypalResponse.json();

    if (paymentDetails.status !== 'COMPLETED') {
      console.error("Payment not completed:", paymentDetails);
      return;
    }

    // Find user and update subscription
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

    console.log("Subscription updated successfully for user:", clerkUserId);
  } catch (error) {
    console.error("Error verifying payment:", error);
  }
};
