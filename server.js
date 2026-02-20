/**
 * Feedback System API Server
 * V3 - "Architectural Evolution"
 *
 * A REST API backend with service layer, repository pattern,
 * comprehensive logging, and automated testing.
 */

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./features/user/userRoutes.js";
import feedbackRoutes from "./features/feedback/feedbackRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { logger, logRequest } from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use(logRequest);

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
    version: "3.0.0",
    architecture: "Service Layer + Repository Pattern",
    features: [
      "JWT Authentication",
      "Password Hashing",
      "Input Validation",
      "Rate Limiting",
      "Winston Logging",
      "Service Layer",
      "Repository Pattern",
    ],
  });
});

// API info endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Feedback System API",
    version: "3.0.0",
    description: "Architectural Evolution - Service Layer & Repository Pattern",
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
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`Version: 3.0.0 - "Architectural Evolution"`);
});
