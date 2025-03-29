import ImageKit from "imagekit";
import Redis from "ioredis";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const redis = new Redis(); // Initialize Redis

export const getPosts = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const lastCreatedAt = req.query.lastCreatedAt;
    const cacheKey = `posts:${JSON.stringify(req.query)}`;

    // Try fetching from Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const query = {};
    const { author, search, location, propertytype, bedrooms, bathrooms, propertysize, rooms, pricemax, pricemin, model, featured } = req.query;

    // Filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } }
      ];
    }
    if (author) query.author = { $regex: author, $options: "i" };
    if (location) query["location.city"] = { $regex: location, $options: "i" };
    if (propertytype) query.propertytype = propertytype;
    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms) };
    if (propertysize) query.propertysize = { $gte: parseInt(propertysize) };
    if (rooms) query.rooms = { $gte: parseInt(rooms) };
    if (pricemin || pricemax) {
      query.price = {};
      if (pricemin) query.price.$gte = parseInt(pricemin);
      if (pricemax) query.price.$lte = parseInt(pricemax);
    }
    if (model) query.model = model;
    if (featured) query.isFeatured = true;
    if (lastCreatedAt) query.createdAt = { $lt: new Date(lastCreatedAt) };

    // Sorting
    const sort = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // Fetch posts
    const posts = await Post.find(query)
      .select("title slug price location createdAt isFeatured")
      .sort(sort)
      .limit(pageSize)
      .lean();

    // Cache the response for 60 seconds
    await redis.setex(cacheKey, 60, JSON.stringify(posts));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Internal server error!");
  }
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img"
  );
  res.status(200).json(post);
};


export const createPost = async (req, res) => {
  try {
    // Log request headers for debugging
    console.log("Request Headers:", req.headers);

    const clerkUserId = req.auth.userId;

    // Check if the user is authenticated
    if (!clerkUserId) {
      console.log("Not authenticated, returning 401.");
      return res.status(401).json("Not authenticated!");
    }

    // Find the user in the database
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      console.log("User not found, returning 404.");
      return res.status(404).json("User not found!");
    }

    // Generate slug from title
    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug });
    let counter = 2;

    // Handle slug collision by appending a counter
    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    // Extract location data from Vercel headers
    const location = {
      country: req.headers["x-vercel-ip-country"] || "Unknown",
      city: req.headers["x-vercel-ip-city"] || "Unknown",
      region: req.headers["x-vercel-ip-region"] || "Unknown",
      timezone: req.headers["x-vercel-ip-timezone"] || "Unknown",

    };

    console.log("Extracted location data:", location);

    // Create a new post object with the validated data
    const newPost = new Post({
      user: user._id,
      slug,
      location,
      ...req.body,
    });

    // Save the post to the database
    const post = await newPost.save();

    // Send the response with the created post
    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json("Internal server error!");
  }
};


export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json("Post has been deleted");
  }

  const user = await User.findOne({ clerkUserId });

  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res.status(403).json("You can delete only your posts!");
  }

  res.status(200).json("Post has been deleted");
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("You cannot feature posts!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  );

  res.status(200).json(updatedPost);
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};