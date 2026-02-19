/**
 * Authentication Middleware
 * V1 - Simple token-based authentication
 *
 * Note: This is intentionally naive for V1.
 * V2 will implement JWT and bcrypt.
 */

import User from "../models/User.js";

/**
 * Extract user from Authorization header
 * V1 uses simple user ID as token
 *
 * @param {string} authHeader - Authorization header value
 * @returns {Object|null} User object or null
 */
const getUserFromToken = async (authHeader) => {
  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <userId>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  const userId = parts[1];

  try {
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to require authentication
 * Attaches user to request object if authenticated
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const user = await getUserFromToken(authHeader);

  if (!user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required. Please log in.",
    });
  }

  req.user = user;
  next();
};

/**
 * Middleware to require admin role
 * Must be used after requireAuth middleware
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required. Please log in.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin access required.",
    });
  }

  next();
};

export default { requireAuth, requireAdmin };
