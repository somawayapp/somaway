import express from 'express';
import { updateSubscriptionFromPayment, authenticateUser } from '../controllers/subscription.controller.js';
const router = express.Router();

// Use the authenticateUser middleware to check the token
router.post('/update-from-payment', authenticateUser, updateSubscriptionFromPayment);

export default router;
