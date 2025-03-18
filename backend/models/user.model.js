import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true, // Index for faster lookups
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription", // optional, no `required: true`
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Add index for querying
    },
    img: {
      type: String,
    },
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

// Virtual population for saved posts (optional)
userSchema.virtual("savedPostDetails", {
  ref: "Post",
  localField: "savedPosts",
  foreignField: "_id",
});

export default mongoose.model("User", userSchema);
