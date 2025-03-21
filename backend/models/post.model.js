import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String], 
      validate: {
        validator: function (arr) {
          return arr.length >= 5 && arr.length <= 10;
        },
        message: "A post must have between 5 and 10 images.",
      },
      required: true, 
    },
    
    title: {
      type: String,
      required: true,
    },
    whoshouldread: {
      type: String,
      required: false,
    },  
     aboutauthor: {
      type: String,
      required: false,
    },  
     aboutbook: {
      type: String,
      required: false,
    },
    summary: {
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
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "self-growth",
    },
    isFeatured: {
      type: Boolean,
      default: false,
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
