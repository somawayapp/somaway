import express from "express";
import {
  getListingReviews,
  getListingReview,
  createListingReview,
  uploadAuth,
} from "../controllers/review.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getListingReviews);
router.get("/:slug", increaseVisit, getListingReview);
router.post("/", createListingReview);

export default router;
