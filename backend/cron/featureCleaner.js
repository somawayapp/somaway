import cron from "node-cron";
import Post from "../models/Post.js"; // adjust path if your models are elsewhere

// Runs every hour
cron.schedule("0 * * * *", async () => {
  const now = new Date();
  try {
    await Post.updateMany(
      { isFeatured: true, featuredUntil: { $lt: now } },
      { isFeatured: false, featuredUntil: null }
    );
    console.log(`[CRON] Unfeatured expired posts at ${now.toISOString()}`);
  } catch (err) {
    console.error("[CRON ERROR]", err);
  }
});
