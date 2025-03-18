import express from "express";
import { verifyPayment } from "../controllers/subscription.controller.js";
import { requireAuth } from "@clerk/express"; // Import Clerk's requireAuth

const router = express.Router();

// Use the requireAuth middleware to check authentication and log the auth state
router.post("/", requireAuth, (req, res) => {
  console.log("Auth State:", req.auth);
  res.status(200).send("User authenticated successfully");
});

// Update subscription route
router.post("/verifyPayment", requireAuth, verifyPayment);

export default router;
