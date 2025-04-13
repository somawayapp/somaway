import { Schema } from "mongoose";
import mongoose from "mongoose";
import slugify from "slugify";

// Schema definition
const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: {
      type: [String],
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
    location: {
      country: String,
      city: String,
      region: String,
      timezone: String,
    },
  },
  { timestamps: true }
);

// Text & search indexes
postSchema.index({ title: "text", desc: "text" });
postSchema.index({ "location.city": 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ price: 1 });
postSchema.index({ isFeatured: 1 });

// 🔥 Compound indexes
postSchema.index({ "location.city": 1, price: 1 });
postSchema.index({ "location.city": 1, createdAt: -1 });

// 🌿 Sparse index for featured logic
postSchema.index({ isFeatured: 1, featuredUntil: 1 }, { sparse: true });

// ⏳ Optional TTL index to auto-delete expired featured posts
// postSchema.index({ featuredUntil: 1 }, { expireAfterSeconds: 0 }); // WARNING: deletes doc

// Slug generation
postSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Post", postSchema);
