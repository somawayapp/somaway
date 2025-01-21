import express from 'express';
import { updateSubscriptionFromPayment } from '../controllers/subscription.controller.js';

const router = express.Router();

// Route to update subscription after payment
router.post('/update-from-payment', updateSubscriptionFromPayment);

export default router;
