import mongoose, { Schema } from "mongoose";

const phoneSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      country: String,
      city: String,
      region: String,
      timezone: String,
    },
  },
  { timestamps: true }
);

// Optional indexes
phoneSchema.index({ "location.city": 1 });
phoneSchema.index({ createdAt: -1 });

export default mongoose.model("Phone", phoneSchema);
