import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cache from "memory-cache"; // In-memory cache

const CACHE_DURATION = 3600000; // 1 hour in milliseconds


export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const query = {};

    // Create a normalized cache key
    const cacheKey = `posts:${JSON.stringify(req.query)}:${page}:${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached data for getPosts");
      return res.status(200).json(cachedData);
    }

    // Extract filters
    const {
      author,
      search,
      sort,
      location,
      propertytype,
      bedrooms,
      bathrooms,
      propertysize,
      rooms,
      pricemax,
      pricemin,
      model,
      featured,
      listed,

    } = req.query;

    // Build dynamic query
    if (req.query.cat) query.category = req.query.cat;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
      ];
    }

    if (author) {
      const authorNames = author
        .split(/[,;|\s]+/)
        .map((name) => name.trim())
        .filter(Boolean);
      const authorRegexes = authorNames.map((name) => new RegExp(name, "i"));
      query.author = { $in: authorRegexes };
    }

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
    if (listed) query.isListed = true;

//sort and sarch users by phone numbers and names maybe, latst, oldest, 
//when someone joins the games their  needs to be a submit form  where someone can be able to enter their phone number and then we 
// will need to be able to text them the  sms to pay one shiling and once the payment has been authtiticated then we will nee to add 
// their phone  number and extract their full name and ad them to the database. update the total price 
//

//we will have to find  a  way in which we can publicly how the hash draw code and pulicly show the drawinf= d proceess on how the
//  winner will  be selcted.


    let sortObj = { createdAt: -1 };
    let useAggregation = false;

    switch (sort) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        };
        break;
      case "random":
        useAggregation = true;
        break;
    }

    let posts;
    let hasMore = false;

    if (useAggregation) {
      posts = await Post.aggregate([
        { $match: query },
        { $sample: { size: limit } },
      ]);
      posts = await Post.populate(posts, { path: "user", select: "username" });
      hasMore = false; // random = no pagination
    } else {
      posts = await Post.find(query)
        .populate("user", "username")
        .sort(sortObj)
        .limit(limit + 1)
        .skip((page - 1) * limit)
        .lean();

      hasMore = posts.length > limit;
      if (hasMore) posts.pop(); // Remove the extra one
    }

    const result = { posts, hasMore };
    cache.put(cacheKey, result, CACHE_DURATION);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Internal server error!");
  }
};


export const getPost = async (req, res) => {
  try {
    const slug = req.params.slug;
    const cacheKey = `post:${slug}`;

    // Check if the post is cached
    const cachedPost = cache.get(cacheKey);
    if (cachedPost) {
      console.log("Returning cached post");
      return res.status(200).json(cachedPost);
    }

    const post = await Post.findOne({ slug }).populate("user", "username img");

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    // Cache the result
    cache.put(cacheKey, post, CACHE_DURATION);

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json("Internal server error!");
  }
};

// Keep the rest of the methods as they are...




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



export const togglePostListing = async (req, res) => {
  const { id } = req.params;
  const { isListed } = req.body;
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  try {
    if (role === "admin") {
      const post = await Post.findByIdAndUpdate(id, { isListed }, { new: true });
      return res.status(200).json(post);
    }

    const user = await User.findOne({ clerkUserId });
    const post = await Post.findOneAndUpdate(
      { _id: id, user: user._id },
      { isListed },
      { new: true }
    );

    if (!post) {
      return res.status(403).json("You can update only your posts!");
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json("Server error");
  }
};



export const toggleFeatured = async (req, res) => {
  const { id } = req.params;
  const { isFeatured, featuredUntil } = req.body;
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  try {
    const update = {
      isFeatured,
      featuredUntil: isFeatured ? featuredUntil : null, // null if unboosting
    };

    let post;
    if (role === "admin") {
      post = await Post.findByIdAndUpdate(id, update, { new: true });
    } else {
      const user = await User.findOne({ clerkUserId });
      post = await Post.findOneAndUpdate(
        { _id: id, user: user._id },
        update,
        { new: true }
      );
    }

    if (!post) {
      return res.status(403).json("You can update only your posts!");
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json("Server error");
  }
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