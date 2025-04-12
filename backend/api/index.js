import { clerkMiddleware, requireAuth } from '@clerk/express';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClerkClient } from '@clerk/backend';
import userRouter from '../routes/user.route.js';
import postRouter from '../routes/post.route.js';
import commentRouter from '../routes/comment.route.js';
import webhookRouter from '../routes/webhook.route.js';
import subscriptionRouter from '../routes/subscription.route.js';
import cors from 'cors';
import 'dotenv/config';
import ratingRouter from '../routes/rating.route.js';
import likeRouter from '../routes/like.route.js';
import Post from "../models/post.model.js"; // Import Post model
import moment from 'moment-timezone'; // Import moment-timezone

dotenv.config();

const app = express();

// Initialize Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
});

// Use Clerk middleware
app.use(clerkMiddleware({ clerkClient }));

// Middleware for JSON parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://makesomaway.com',
        'https://www.makesomaway.com', 
        'https://somawayclient.vercel.app',
        'https://blogifiyclient.vercel.app',
        'http://localhost:5173',
        'https://www.xtechnewsletter.com',
        'https://xtechnewsletter.com',
      ];

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware for unfeaturing expired posts

// Middleware for unfeaturing expired posts
const unfeatureCleanerMiddleware = async (req, res, next) => {
  try {
    // Get the current time in Nairobi (EAT)
    const now = moment().tz('Africa/Nairobi');  // Current time in Nairobi's time zone

    // Update the posts that are featured and expired based on Nairobi time
    const result = await Post.updateMany(
      { isFeatured: true, featuredUntil: { $lte: now.toDate() } }, // Convert moment to native Date
      { isFeatured: false, featuredUntil: null }
    );

    console.log(`[Middleware] Unfeatured ${result.modifiedCount} posts at ${now.toISOString()}`);
  } catch (err) {
    console.error('[Middleware] Error cleaning featured posts:', err);
  }
  next(); // Proceed to the next middleware or route handler
};


// Apply the unfeature cleaner middleware globally
app.use(unfeatureCleanerMiddleware);

// API Routes
app.use('/users', userRouter);
app.use('/posts', postRouter); 
app.use('/subscriptions', subscriptionRouter);
app.use('/comments', commentRouter);
app.use('/webhook', webhookRouter);
app.use('/ratings', ratingRouter);
app.use('/likes', likeRouter);

// Debug route to confirm server is running
app.get('/debug', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const mongoURI = process.env.DATABASE_URL;

if (!mongoURI) {
  console.error('DATABASE_URL is missing in .env');
  process.exit(1);
}

console.log('MongoDB URI:', mongoURI);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

