import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { createClerkClient } from '@clerk/backend';

// Import Routes
import userRouter from '../routes/user.route.js';
import postRouter from '../routes/post.route.js';
import commentRouter from '../routes/comment.route.js';
import webhookRouter from '../routes/webhook.route.js';

// Load environment variables
dotenv.config();

const app = express();

// Allowed CORS origins
const allowedOrigins = [
  'https://makesomaway.com',
  'https://www.makesomaway.com',
  'https://somawayclient.vercel.app',
  'https://blogifiyclient.vercel.app',
  'http://localhost:5173',
  'https://www.xtechnewsletter.com',
  'https://xtechnewsletter.com',
];

// Configure CORS - Allow only specific origins
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Request Origin:', origin); // Debugging
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS Error: Origin ${origin} is not allowed.`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Initialize Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
});

// Use Clerk middleware
app.use(clerkMiddleware({ clerkClient }));

// Middleware for JSON parsing
app.use(express.json());

// Debug route
app.get('/test', (req, res) => {
  res.status(200).send('It works!');
});

// Authentication test routes
app.get('/auth-state', (req, res) => {
  res.json(req.auth);
});

app.get('/protect', (req, res) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json('Not authenticated');
  }
  res.status(200).json('Content');
});

app.get('/protect2', requireAuth(), (req, res) => {
  res.status(200).json('Content');
});

// API Routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/webhook', webhookRouter);

// Debug route to confirm server is running
app.get('/debug', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// MongoDB Connection
const mongoURI = process.env.DATABASE_URL;

if (!mongoURI) {
  console.error('DATABASE_URL is missing in .env');
  process.exit(1);
}

console.log('MongoDB URI:', mongoURI);

mongoose
  .connect(mongoURI)
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
