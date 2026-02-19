/**
 * Feedback Controller
 * Handles business logic for feedback endpoints
 */

import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

/**
 * Get all feedback
 * @route GET /api/feedback
 * @access Admin only
 */
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "email role")
      .sort({ createdAt: -1 });

    res.json({
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Get a single feedback by ID
 * @route GET /api/feedback/:id
 * @access Admin only
 */
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      "userId",
      "email role",
    );

    if (!feedback) {
      return res.status(404).json({
        error: "Not Found",
        message: "Feedback not found",
      });
    }

    res.json(feedback);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid feedback ID format",
      });
    }
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Create new feedback
 * @route POST /api/feedback
 * @access User or Admin (requires authentication)
 */
export const createFeedback = async (req, res) => {
  try {
    const { message, category, status } = req.body;

    // Get user ID from authenticated user
    const userId = req.user._id;

    // Create feedback
    const feedback = await Feedback.create({
      userId,
      message,
      category: category || "general",
      status: status || "pending",
    });

    // Populate user info for response
    await feedback.populate("userId", "email role");

    res.status(201).json(feedback);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Bad Request",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Update feedback status
 * @route PATCH /api/feedback/:id
 * @access Admin only
 */
export const updateFeedback = async (req, res) => {
  try {
    const { message, category, status } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (message !== undefined) updateData.message = message;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    ).populate("userId", "email role");

    if (!feedback) {
      return res.status(404).json({
        error: "Not Found",
        message: "Feedback not found",
      });
    }

    res.json(feedback);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid feedback ID format",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Bad Request",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Delete feedback
 * @route DELETE /api/feedback/:id
 * @access Admin only
 */
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        error: "Not Found",
        message: "Feedback not found",
      });
    }

    res.json({
      message: "Feedback deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid feedback ID format",
      });
    }
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Get feedback by user ID
 * @route GET /api/feedback/user/:userId
 * @access User (own feedback) or Admin
 */
export const getFeedbackByUser = async (req, res) => {
  try {
    // Check if user is requesting their own feedback or is admin
    const requestedUserId = req.params.userId;
    const currentUserId = req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && currentUserId !== requestedUserId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only view your own feedback",
      });
    }

    const feedback = await Feedback.find({ userId: requestedUserId })
      .populate("userId", "email role")
      .sort({ createdAt: -1 });

    res.json({
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid user ID format",
      });
    }
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export default {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByUser,
};
