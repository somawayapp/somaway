import express from 'express';
import { getSubscriptionDetails, updateSubscription } from '../controllers/subscription.controller.js';

const router = express.Router();

// Route to update subscription
router.put('/update', updateSubscription);

// Route to get subscription details  
router.get('/details', getSubscriptionDetails);

export default router;
