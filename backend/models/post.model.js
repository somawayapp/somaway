import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indexing for faster lookups
    },
    title: {
      type: String,
      required: true,
      index: "text", // Full-text search
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    desc: {
      type: String,
      required: true,
      index: "text", // Full-text search
    },
    whatsapp: {
      type: String,
    },
    phone: {
      type: String,
    },
    price: {
      type: Number,
      index: true, // Index price for range queries
    },
    amenities: {
      type: [String],
    },
    img: {
      type: [String], // Array of image URLs
    },
    model: {
      type: String,
      enum: ["For Sale", "For Rent"], // Constraint for consistency
    },
    propertytype: {
      type: String,
    },
    specification: {
      type: String,
    },
    propertysize: {
      type: Number, // Changed from String to Number for numeric comparisons
      index: true,
    },
    bathrooms: {
      type: Number,
      index: true,
    },
    bedrooms: {
      type: Number,
      index: true,
    },
    rooms: {
      type: Number,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    visit: {
      type: Number,
      default: 0,
      index: true,
    },
    location: {
      country: { type: String, index: true },
      city: { type: String, index: true },
      region: { type: String },
      timezone: { type: String },
    },
  },
  { timestamps: true }
);

// Create compound indexes for performance
postSchema.index({ price: 1, bedrooms: 1, bathrooms: 1 });
postSchema.index({ "location.city": 1 });
postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);
