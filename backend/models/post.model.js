import Post from "../models/Post.js";

// 📥 Get posts with lean and pagination
export const getPosts = async (req, res) => {
  try {
    const { city, priceMin, priceMax, lastSeen, limit = 10 } = req.query;

    const filters = {};
    if (city) filters["location.city"] = city;
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = Number(priceMin);
      if (priceMax) filters.price.$lte = Number(priceMax);
    }
    if (lastSeen) {
      filters.createdAt = { $lt: new Date(lastSeen) };
    }

    const posts = await Post.find(filters)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("title price location isFeatured createdAt slug img")
      .lean();

    res.json(posts);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
