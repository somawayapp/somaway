import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Optimize database queries with `.lean()`, and remove redundant operations
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
        case "trending":
          sortObj = { visit: -1 };
          if (sort === "trending") {
            query.createdAt = {
              $gte: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
            };
          }
          break;
        case "random":
          useAggregation = true;
          break;
        default:
          break;
      }
    }

    let posts, totalPosts;

    if (useAggregation) {
      // Aggregation pipeline for random sorting
      posts = await Post.aggregate([
        { $match: query },
        { $sample: { size: limit } },
      ]);

      posts = await Post.populate(posts, { path: "user", select: "username" });

      totalPosts = await Post.countDocuments(query);
    } else {
      // Use `.lean()` to avoid Mongoose document overhead
      posts = await Post.find(query)
        .populate("user", "username")
        .sort(sortObj)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      totalPosts = await Post.countDocuments(query);
    }

    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Internal server error!");
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "user",
      "username img"
    ).lean();
    if (!post) return res.status(404).json("Post not found!");
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json("Internal server error!");
  }
};

export const createPost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId }).lean();
    if (!user) {
      return res.status(404).json("User not found!");
    }

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug }).lean();
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug }).lean();
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

    const user = await User.findOne({ clerkUserId }).lean();
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    }).lean();

    if (!deletedPost) {
      return res.status(403).json("You can delete only your posts!");
    }

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
    const duration = parseInt(req.body.duration); // in days

    if (!clerkUserId) return res.status(401).json("Not authenticated!");

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") return res.status(403).json("You cannot feature posts!");

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json("Post not found!");

    const isFeatured = post.isFeatured;
    let updateFields = { isFeatured: !isFeatured, featuredUntil: null };

    if (!isFeatured && duration) {
      updateFields.featuredUntil = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateFields, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error featuring post:", error);
    res.status(500).json("Internal server error!");
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error authenticating image upload:", error);
    res.status(500).json("Internal server error!");
  }
};
