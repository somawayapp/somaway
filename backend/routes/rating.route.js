import express from "express";
import { getPostRatings, addRating, deleteRating } from "../controllers/rating.controller.js";

const router = express.Router();

router.get("/:postId", getPostRatings);
router.post("/:postId", addRating);
router.delete("/:id", deleteRating);

export default router;

