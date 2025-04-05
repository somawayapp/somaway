import Like from "../models/like.model.js";
import User from "../models/user.model.js";

// Like a post
export const likePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) return res.status(404).json("User not found!");

  const existingLike = await Like.findOne({ user: user._id, post: postId });
  if (existingLike) {
    return res.status(400).json("Post already liked");
  }

  const newLike = new Like({ user: user._id, post: postId });
  await newLike.save();

  res.status(201).json("Post liked");
};

// Unlike a post
export const unlikePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) return res.status(404).json("User not found!");

  const deleted = await Like.findOneAndDelete({ user: user._id, post: postId });

  if (!deleted) {
    return res.status(404).json("Like not found");
  }

  res.status(200).json("Post unliked");
};

// Check if post is liked
export const isPostLiked = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) return res.status(404).json("User not found!");

  const like = await Like.findOne({ user: user._id, post: postId });

  res.status(200).json({ liked: !!like });
};

// Get all liked posts
export const getLikedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) return res.status(404).json("User not found!");

  const likes = await Like.find({ user: user._id }).populate("post");

  res.status(200).json(likes.map(l => l.post));
};
