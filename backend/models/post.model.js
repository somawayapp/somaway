import { Schema } from "mongoose";
import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: {
      type: [String],
      required: false,
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
    whatsapp: String,
    phone: String,
    price: Number,
    amenities: [String],
    model: String,
    propertytype: String,
    specification: String,
    propertysize: String,
    bathrooms: Number,
    bedrooms: Number,
    rooms: Number,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: {
      type: Date,
      default: null,
    },
    visit: {
      type: Number,
      default: 0,
    },
    isListed: {
      type: Boolean,
      default: true,
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

// Indexes
postSchema.index({ title: "text", desc: "text" });
postSchema.index({ "location.city": 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ price: 1 });
postSchema.index({ isFeatured: 1 });

// Auto-generate slug if missing
postSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Post", postSchema);
