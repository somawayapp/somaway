import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: {
      type: [String], 
      required: true, 
    },
    
    title: {
      type: String,
      required: true,
    },
    propertyname: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },

    whatsapp: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    amenities: {
      type: [String],
      required: false,
    },
    img: {
      type: [String], // Array of image URLs
      required: false,
    },
    model: {
      type: String,
      required: false,
    },
    propertytype: {
      type: String,
      required: false,
    },
    specification: {
      type: String,
      required: false,
    },
    propertysize: {
      type: String,
      required: false,
    },
    bathrooms: {
      type: Number,
      required: false,
    },
    bedrooms: {
      type: Number,
      required: false,
    },
    rooms: {
      type: Number,
      required: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isfeaturedUntil: {
      type: Date,
      default: null, 
    },
    visit: {
      type: Number,
      default: 0,
    },
    location: {
      country: { type: String },
      city: { type: String },
      region: { type: String },
      timezone: { type: String },

    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
