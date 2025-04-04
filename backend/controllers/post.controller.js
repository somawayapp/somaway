import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Redis from "ioredis";

const redis = new Redis(); // Initialize Redis connection

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const cacheKey = `posts:${JSON.stringify(req.query)}`;

    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const query = {};
    const { author, search, sort, location, propertytype, bedrooms, bathrooms, propertysize, rooms, pricemax, pricemin, model, featured } = req.query;

    // Category Filter
    if (req.query.cat) query.category = req.query.cat;

    // Full-Text Search Optimization
    if (search) query.$text = { $search: search };

    // Author Filter
    if (author) query.author = { $in: author.split(/[,;|\s]+/).map(name => new RegExp(name.trim(), "i")) };

    // Location Filter
    if (location) query["location.city"] = { $regex: location, $options: "i" };

    // Property Type Filter
    if (propertytype) query.propertytype = propertytype;

    // Numeric Filters
    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms) };
    if (propertysize) query.propertysize = { $gte: parseInt(propertysize) };
    if (rooms) query.rooms = { $gte: parseInt(rooms) };

    // Price Range Filter
    if (pricemin || pricemax) {
      query.price = {};
      if (pricemin) query.price.$gte = parseInt(pricemin);
      if (pricemax) query.price.$lte = parseInt(pricemax);
    }

    // Model Filter (For Rent / For Sale)
    if (model) query.model = model;

    // Featured Filter
    if (featured) query.isFeatured = true;

    // Sorting Logic
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { visit: -1 },
      trending: { visit: -1, createdAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } },
    };

    const sortObj = sortOptions[sort] || { createdAt: -1 };

    // Fetch posts with optimized query
    const posts = await Post.find(query)
      .populate("user", "username")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .select("title slug price bedrooms bathrooms location createdAt")
      .lean();

    const totalPosts = await Post.countDocuments(query);
    const hasMore = page * limit < totalPosts;

    const response = { posts, hasMore };

    // Store in Redis Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(response));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Internal server error!");
  }
};

// GET SINGLE POST
export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `post:${slug}`;

    // Check cache first
    const cachedPost = await redis.get(cacheKey);
    if (cachedPost) {
      return res.status(200).json(JSON.parse(cachedPost));
    }

    // Fetch post
    const post = await Post.findOne({ slug })
      .populate("user", "username img")
      .select("title slug price bedrooms bathrooms location desc createdAt")
      .lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Cache post for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(post));

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json("Internal server error!");
  }
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