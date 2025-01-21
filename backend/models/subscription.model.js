import mongoose from "mongoose";
import { Schema } from "mongoose";

// Subscription Schema
const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["monthly", "annual", "none"],
      default: "none",
    },
    startDate: {
      type: Date,
      default: Date.now, // set default to current date if not provided
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);

