/**
 * Feedback Routes
 * V2 - Endpoints with validation and rate limiting
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
import {
  requireAuth,
  requireAdmin,
  requireOwnershipOrAdmin,
} from "../middleware/auth.js";
import {
  validateCreateFeedback,
  validateUpdateFeedback,
  validateFeedbackId,
} from "../middleware/validators.js";
import { generalLimiter, feedbackLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback
 * @access  Admin only
 */
router.get("/", generalLimiter, requireAuth, requireAdmin, getAllFeedback);

/**
 * @route   POST /api/feedback
 * @desc    Create new feedback
 * @access  User or Admin (requires authentication)
 */
router.post(
  "/",
  feedbackLimiter,
  requireAuth,
  validateCreateFeedback,
  createFeedback,
);

/**
 * @route   GET /api/feedback/user/:userId
 * @desc    Get feedback by user ID
 * @access  User (own feedback) or Admin
 */
router.get(
  "/user/:userId",
  generalLimiter,
  requireAuth,
  requireOwnershipOrAdmin("userId"),
  getFeedbackByUser,
);

/**
 * @route   GET /api/feedback/:id
 * @desc    Get feedback by ID
 * @access  Admin only
 */
router.get(
  "/:id",
  generalLimiter,
  requireAuth,
  requireAdmin,
  validateFeedbackId,
  getFeedbackById,
);

/**
 * @route   PATCH /api/feedback/:id
 * @desc    Update feedback
 * @access  Admin only
 */
router.patch(
  "/:id",
  generalLimiter,
  requireAuth,
  requireAdmin,
  validateUpdateFeedback,
  updateFeedback,
);

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete feedback
 * @access  Admin only
 */
router.delete(
  "/:id",
  generalLimiter,
  requireAuth,
  requireAdmin,
  validateFeedbackId,
  deleteFeedback,
);

export default router;
