/**
 * User Routes
 * Defines endpoints for user management
 */

import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/userController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/user/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/user
 * @desc    Get all users
 * @access  Admin only
 */
router.get("/", requireAuth, requireAdmin, getAllUsers);

/**
 * @route   POST /api/user
 * @desc    Create a new user
 * @access  Admin only
 */
router.post("/", requireAuth, requireAdmin, createUser);

/**
 * @route   GET /api/user/:id
 * @desc    Get user by ID
 * @access  Admin only
 */
router.get("/:id", requireAuth, requireAdmin, getUserById);

/**
 * @route   PATCH /api/user/:id
 * @desc    Update user
 * @access  Admin only
 */
router.patch("/:id", requireAuth, requireAdmin, updateUser);

/**
 * @route   DELETE /api/user/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete("/:id", requireAuth, requireAdmin, deleteUser);

export default router;
