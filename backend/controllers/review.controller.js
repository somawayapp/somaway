import ImageKit from "imagekit";
import Review from "../models/review.model.js";

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

    // Fetch reviews with the final query object
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 }) // Sorting by created date
      .limit(limit)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments(query);
    const hasMore = page * limit < totalReviews;

    res.status(200).json({ reviews, hasMore });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json("Internal server error!");
  }
};

export const getListingReview = async (req, res) => {
  try {
    const review = await Review.findOne({ slug: req.params.slug });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json("Internal server error!");
  }
};

export const createListingReview = async (req, res) => {
    try {
      // Log request headers for debugging
      console.log("Request Headers:", req.headers);
  
      // Generate slug from name
      let slug = req.body.propertyname.replace(/ /g, "-").toLowerCase();
      let existingReview = await Review.findOne({ slug });
      let counter = 2;
  
      // Handle slug collision by appending a counter
      while (existingReview) {
        slug = `${slug}-${counter}`;
        existingReview = await Review.findOne({ slug });
        counter++;
      }
  
      // Create a new review object with the validated data
      const newReview = new Review({
        slug,
        ...req.body,
      });
  
      // Save the review to the database
      const review = await newReview.save();
  
      // Send the response with the created review
      res.status(200).json(review);
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