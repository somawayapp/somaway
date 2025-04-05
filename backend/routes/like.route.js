// routes/like.routes.js
import express from "express";
import {
  likePost,
  unlikePost,
  isPostLiked,
  getLikedPosts,
} from "../controllers/like.controller.js";

const router = express.Router();

router.post("/:postId", likePost);
router.delete("/:postId", unlikePost);
router.get("/:postId", isPostLiked);
router.get("/", getLikedPosts);

export default router;
