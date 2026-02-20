/**
 * User Routes
 * V3 - Feature-based routes with validation and rate limiting
 */

const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getCurrentUser,
} = require("./userController.js");
const { requireAuth, requireAdmin } = require("../../middleware/auth.js");
const {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateUserId,
} = require("../../middleware/validators.js");
const {
  loginLimiter,
  generalLimiter,
} = require("../../middleware/rateLimiter.js");

const router = express.Router();

/**
 * @route   POST /api/user/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginLimiter, validateLogin, loginUser);

/**
 * @route   GET /api/user/me
 * @desc    Get current user profile
 * @access  Authenticated user
 */
router.get("/me", requireAuth, getCurrentUser);

/**
 * @route   GET /api/user
 * @desc    Get all users
 * @access  Admin only
 */
router.get("/", generalLimiter, requireAuth, requireAdmin, getAllUsers);

/**
 * @route   POST /api/user
 * @desc    Create a new user
 * @access  Admin only
 */
router.post(
  "/",
  generalLimiter,
  requireAuth,
  requireAdmin,
  validateCreateUser,
  createUser,
);

/**
 * @route   GET /api/user/:id
 * @desc    Get user by ID
 * @access  Admin only
 */
router.get(
  "/:id",
  generalLimiter,
  requireAuth,
  requireAdmin,
  validateUserId,
  getUserById,
);

/**
 * @route   PATCH /api/user/:id
 * @desc    Update user
 * @access  Admin only
 */
router.patch(
  "/:id",
  generalLimiter,
  requireAuth,
  requireAdmin,
  validateUpdateUser,
  updateUser,
);

/**
 * @route   DELETE /api/user/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete(
  "/:id",
  generalLimiter,
  requireAuth,
  requireAdmin,
  validateUserId,
  deleteUser,
);

module.exports = router;
