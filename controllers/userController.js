/**
 * User Controller
 * Handles business logic for user endpoints
 */

import User from "../models/User.js";

/**
 * Get all users
 * @route GET /api/user
 * @access Admin only
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Get a single user by ID
 * @route GET /api/user/:id
 * @access Admin only
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
    }

    res.json(user);
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

/**
 * Create a new user
 * @route POST /api/user
 * @access Admin only
 */
export const createUser = async (req, res) => {
  try {
    const { email, password, role, isVerified } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "Conflict",
        message: "User with this email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      role: role || "user",
      isVerified: isVerified || false,
    });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
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
 * Update a user
 * @route PATCH /api/user/:id
 * @access Admin only
 */
export const updateUser = async (req, res) => {
  try {
    const { email, password, role, isVerified } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = password;
    if (role !== undefined) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid user ID format",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Bad Request",
        message: error.message,
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Conflict",
        message: "Email already in use",
      });
    }
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

/**
 * Delete a user
 * @route DELETE /api/user/:id
 * @access Admin only
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
      id: req.params.id,
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

/**
 * User login
 * @route POST /api/user/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Check password (plain text comparison for V1)
    if (user.password !== password) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Return user info and simple token (user ID for V1)
    res.json({
      message: "Login successful",
      token: user._id.toString(),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
