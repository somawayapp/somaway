import cron from "node-cron";
import Post from "../models/post.model.js";

// Runs every hour


cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const result = await Post.updateMany(
        { isFeatured: true, featuredUntil: { $lte: now } },
        { isFeatured: false, featuredUntil: null }
      );
      console.log(`[CRON] Unfeatured ${result.modifiedCount} posts at ${now.toISOString()}`);
    } catch (error) {
      console.error("[CRON] Error while unfeaturing:", error);
    }
  });