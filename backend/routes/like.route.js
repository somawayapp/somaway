// routes/like.routes.js
import express from "express";
import {
  likePost,
  unlikePost,
  isPostLiked,
  getLikedPosts,
} from "../controllers/like.controller.js";

const router = express.Router();

router.post("/like/:postId", likePost);
router.delete("/like/:postId", unlikePost);
router.get("/like/:postId", isPostLiked);
router.get("/likes", getLikedPosts);

export default router;
