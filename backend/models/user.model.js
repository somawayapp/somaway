const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
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
    },
    img: {
      type: String,
    },
    savedPosts: {
      type: [String],
      default: [],
    },
    subscription: {
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
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
