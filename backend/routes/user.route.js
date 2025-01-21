import express from "express"
import { getUserSavedPosts, updateSubscription, getSubscriptionDetails, savePost } from "../controllers/user.controller.js"

const router = express.Router()

  // Use this middleware in your routes
  router.get("/saved", getUserSavedPosts);
  router.patch("/save", savePost);
  router.patch("/update-subscription", updateSubscription);
  router.get("/subscription", getSubscriptionDetails);
  

export default router 