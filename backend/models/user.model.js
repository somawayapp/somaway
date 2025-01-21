
// User Schema
const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: false, // made optional
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
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post", // assuming you have a Post model
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
