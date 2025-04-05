// routes/like.routes.js
import express from "express";
import {
  likePost,
  unlikePost,
  isPostLiked,
  getLikedPosts,
} from "../controllers/like.controller.js";

const router = express.Router();

router.post("/likes/:postId", likePost);
router.delete("/likes/:postId", unlikePost);
router.get("/likes/:postId", isPostLiked);
router.get("/likes", getLikedPosts);

export default router;
