import { Schema } from "mongoose";
import mongoose from "mongoose";

const postSchema = new Schema(
  {
  
    img: {
      type: [String], 
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

    location: {
      type: [String],
      required: false,
    },


    propertytype: {
      type: String,
      required: false,
    },
  

    visit: {
      type: Number,
      default: 0,
    },
  
  },
  { timestamps: true }
);

export default mongoose.model("Review", postSchema);
