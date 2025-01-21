import express from 'express';
import { updateSubscriptionFromPayment } from './subscription.controller.js';
import { authenticateUser } from './subscription.controller.js';

const router = express.Router();

// Use the authenticateUser middleware to check the token
router.post('/update-from-payment', authenticateUser, updateSubscriptionFromPayment);

export default router;
