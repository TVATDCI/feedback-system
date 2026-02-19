/**
 * Feedback System API Server
 * V2 - "About Realism"
 *
 * A REST API backend with JWT authentication, password hashing,
 * input validation, and centralized error handling.
 */

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import feedbackRoutes from "./routes/feedback.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount routes
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Feedback System API is running",
    version: "2.0.0",
    features: [
      "JWT Authentication",
      "Password Hashing",
      "Input Validation",
      "Rate Limiting",
    ],
  });
});

// API info endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Feedback System API",
    version: "2.0.0",
    endpoints: {
      users: "/api/user",
      feedback: "/api/feedback",
      health: "/health",
    },
    documentation: "See README.md for API documentation",
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Version: 2.0.0 - "About Realism"`);
});
