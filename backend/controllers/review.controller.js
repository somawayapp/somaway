import ImageKit from "imagekit";
import Post from "../models/post.model.js";

export const getListingReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = {};

    // Extract query parameters
    const { propertyname, location, propertytype } = req.query;

    if (propertytype) {
      query.propertytype = propertytype;
    }

    if (location) {
      query.location = location;
    }

    if (propertyname) {
      query.propertyname = propertyname;
    }

    // Fetch posts with the final query object
    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) // Sorting by created date
      .limit(limit)
      .skip((page - 1) * limit);

    const totalPosts = await Post.countDocuments(query);
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Internal server error!");
  }
};

export const getListingReview = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json("Internal server error!");
  }
};


export const createListingReview = async (req, res) => {
    try {
      // Log request headers for debugging
      console.log("Request Headers:", req.headers);
  
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
  
      // Create a new post object with the validated data
      const newPost = new Post({
        slug,
        ...req.body,
      });
  
      // Save the post to the database
      const post = await newPost.save();
  
      // Send the response with the created post
      res.status(200).json(post);
    } catch (error) {
      console.error("Error creating Listing Review:", error);
      res.status(500).json("Internal server error!");
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