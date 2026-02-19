/**
 * Feedback Routes
 * Defines endpoints for feedback management
 */

import express from "express";
import {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByUser,
} from "../controllers/feedbackController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback
 * @access  Admin only
 */
router.get("/", requireAuth, requireAdmin, getAllFeedback);

/**
 * @route   POST /api/feedback
 * @desc    Create new feedback
 * @access  User or Admin (requires authentication)
 */
router.post("/", requireAuth, createFeedback);

/**
 * @route   GET /api/feedback/user/:userId
 * @desc    Get feedback by user ID
 * @access  User (own feedback) or Admin
 */
router.get("/user/:userId", requireAuth, getFeedbackByUser);

/**
 * @route   GET /api/feedback/:id
 * @desc    Get feedback by ID
 * @access  Admin only
 */
router.get("/:id", requireAuth, requireAdmin, getFeedbackById);

/**
 * @route   PATCH /api/feedback/:id
 * @desc    Update feedback
 * @access  Admin only
 */
router.patch("/:id", requireAuth, requireAdmin, updateFeedback);

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete feedback
 * @access  Admin only
 */
router.delete("/:id", requireAuth, requireAdmin, deleteFeedback);

export default router;
