import Rating from "../models/rating.model.js";
import User from "../models/user.model.js";

export const getPostRatings = async (req, res) => {
  const postId = req.params.postId;

  const ratings = await Rating.find({ post: postId });

  const totalRatings = ratings.length;
  const avgRating =
    totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / totalRatings
      : 0;

  res.json({
    averageRating: avgRating.toFixed(1),
    totalRatings,
  });
};

export const addRating = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;
  const { stars } = req.body;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated, LOGIN to rate!");
  }

  if (stars < 1 || stars > 5) {
    return res.status(400).json("Rating must be between 1 and 5 stars!");
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const existingRating = await Rating.findOne({ user: user._id, post: postId });

  if (existingRating) {
    existingRating.stars = stars;
    await existingRating.save();
    return res.status(200).json("Rating updated successfully!");
  }

  const newRating = new Rating({
    user: user._id,
    post: postId,
    stars,
  });

  await newRating.save();
  res.status(201).json("Rating added successfully!");
};

export const deleteRating = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const id = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated, LOGIN!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Rating.findByIdAndDelete(id);
    return res.status(200).json("Rating has been deleted");
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const deletedRating = await Rating.findOneAndDelete({
    _id: id,
    user: user._id,
  });

  if (!deletedRating) {
    return res.status(403).json("You can only delete your rating!");
  }

  res.status(200).json("Rating deleted");
};
