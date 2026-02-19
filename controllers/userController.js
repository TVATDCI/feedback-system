/**
 * User Controller
 * V2 - Handles business logic for user endpoints with JWT and bcrypt
 */

import User from "../models/User.js";
import {
  hashPassword,
  comparePassword,
  isBcryptHash,
} from "../utils/passwordHash.js";
import { generateToken } from "../utils/jwt.js";
import {
  NotFoundError,
  ConflictError,
  AuthError,
} from "../middleware/errorHandler.js";

/**
 * Get all users
 * @route GET /api/user
 * @access Admin only
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single user by ID
 * @route GET /api/user/:id
 * @access Admin only
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(new NotFoundError("User"));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 * @route POST /api/user
 * @access Admin only
 */
export const createUser = async (req, res, next) => {
  try {
    const { email, password, role, isVerified } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("User with this email already exists"));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: isVerified || false,
    });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a user
 * @route PATCH /api/user/:id
 * @access Admin only
 */
export const updateUser = async (req, res, next) => {
  try {
    const { email, password, role, isVerified } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) {
      updateData.password = await hashPassword(password);
    }
    if (role !== undefined) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return next(new NotFoundError("User"));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user
 * @route DELETE /api/user/:id
 * @access Admin only
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new NotFoundError("User"));
    }

    res.json({
      message: "User deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User login
 * @route POST /api/user/login
 * @access Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AuthError("Invalid email or password"));
    }

    // Check if password is already hashed (for migration support)
    let passwordMatches;
    if (isBcryptHash(user.password)) {
      // V2: Compare with bcrypt
      passwordMatches = await comparePassword(password, user.password);
    } else {
      // V1 legacy: Plain text comparison (for migration)
      passwordMatches = user.password === password;

      // Lazy migration: Hash the password on successful login
      if (passwordMatches) {
        user.password = await hashPassword(password);
        await user.save();
      }
    }

    if (!passwordMatches) {
      return next(new AuthError("Invalid email or password"));
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user info and JWT token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/user/me
 * @access Authenticated user
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return next(new NotFoundError("User"));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getCurrentUser,
};
