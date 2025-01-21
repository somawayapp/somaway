import mongoose from "mongoose";
import { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    plan: {
      type: String,
      enum: ['monthly', 'annual', 'none'],
      default: 'none',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
