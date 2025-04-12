import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import redis from "redis";
import rateLimit from "express-rate-limit";

// Redis client setup
const client = redis.createClient();

// Set up rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests, please try again later."
});

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const query = {};

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
    } = req.query;

    if (req.query.cat) {
      query.category = req.query.cat;
    }

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

    if (location) {
      query["location.city"] = { $regex: location, $options: "i" };
    }

    if (propertytype) {
      query.propertytype = propertytype;
    }

    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms) };
    if (propertysize) query.propertysize = { $gte: parseInt(propertysize) };
    if (rooms) query.rooms = { $gte: parseInt(rooms) };

    if (pricemin || pricemax) {
      query.price = {};
      if (pricemin) query.price.$gte = parseInt(pricemin);
      if (pricemax) query.price.$lte = parseInt(pricemax);
    }

    if (model) {
      query.model = model;
    }

    if (featured) {
      query.isFeatured = true;
    }

    let sortObj = { createdAt: -1 };
    let useAggregation = false;

    if (sort) {
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
            $gte: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
          };
          break;
        case "random":
          useAggregation = true;
          break;
        default:
          break;
      }
    }

    // Cache check before hitting the database
    const cacheKey = JSON.stringify(query) + sortObj + page + limit;
    client.get(cacheKey, async (err, cachedData) => {
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      let posts, totalPosts;

      if (useAggregation) {
        posts = await Post.aggregate([
          { $match: query },
          { $sample: { size: limit } },
          { $project: { title: 1, slug: 1, price: 1, location: 1, createdAt: 1 } },
        ]);

        posts = await Post.populate(posts, { path: "user", select: "username" });

        totalPosts = await Post.countDocuments(query);
      } else {
        posts = await Post.find(query)
          .populate("user", "username")
          .select("title slug price location createdAt")
          .sort(sortObj)
          .limit(limit)
          .skip((page - 1) * limit);

        totalPosts = await Post.countDocuments(query);
      }

      const hasMore = page * limit < totalPosts;

      // Cache the result for future requests
      client.setex(cacheKey, 3600, JSON.stringify({ posts, hasMore }));

      res.status(200).json({ posts, hasMore });
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Internal server error!");
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("user", "username img");

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json("Internal server error!");
  }
};

export const createPost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json("User not found!");

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug });
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const location = {
      country: req.headers["x-vercel-ip-country"] || "Unknown",
      city: req.headers["x-vercel-ip-city"] || "Unknown",
      region: req.headers["x-vercel-ip-region"] || "Unknown",
      timezone: req.headers["x-vercel-ip-timezone"] || "Unknown",
    };

    const newPost = new Post({
      user: user._id,
      slug,
      location,
      ...req.body,
    });

    const post = await newPost.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json("Internal server error!");
  }
};

export const deletePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) return res.status(401).json("Not authenticated!");

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

    if (!deletedPost) return res.status(403).json("You can delete only your posts!");

    res.status(200).json("Post has been deleted");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json("Internal server error!");
  }
};

export const featurePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;
    const duration = parseInt(req.body.duration);

    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role !== "admin") return res.status(403).json("You cannot feature posts!");

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json("Post not found!");

    const isFeatured = post.isFeatured;

    let updateFields = {
      isFeatured: !isFeatured,
      featuredUntil: null,
    };

    if (!isFeatured && duration) {
      const featuredUntilDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
      updateFields.featuredUntil = featuredUntilDate;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateFields, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error featuring post:", error);
    res.status(500).json("Internal server error!");
  }
};

export const uploadAuth = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    console.error("Error generating upload authentication:", error);
    res.status(500).json("Internal server error!");
  }
};
