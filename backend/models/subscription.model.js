import mongoose from "mongoose";
import { Schema } from "mongoose";


const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for performance
    },
    plan: {
      type: String,
      enum: ["monthly", "annual", "none"],
      default: "none",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      index: true, // TTL index for automatic expiration handling
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    isActive: {
      type: Boolean,
      default: function () {
        return this.status === "active" && this.endDate > Date.now();
      },
    },
  },
  { timestamps: true }
);

// TTL Index for `endDate` (requires MongoDB TTL support)
subscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Subscription", subscriptionSchema);
