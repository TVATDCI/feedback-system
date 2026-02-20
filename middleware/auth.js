/**
 * Authentication Middleware
 * V3 - JWT-based authentication with role-based authorization
 */

const User = require("../features/user/userModel.js");
const { verifyToken } = require("../utils/jwt.js");
const { AuthError, ForbiddenError } = require("./errorHandler.js");

/**
 * Extract and verify JWT from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {Object|null} Decoded token payload or null
 */
const extractToken = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  const token = parts[1];
  return verifyToken(token);
};

/**
 * Middleware to require authentication
 * Verifies JWT and attaches user to request object
 */
const requireAuth = async (req, res, next) => {
  try {
    const decoded = extractToken(req.headers.authorization);

    if (!decoded) {
      return next(new AuthError("Invalid or expired token"));
    }

    // Fetch fresh user data from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AuthError("User no longer exists"));
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error) {
    next(new AuthError("Authentication failed"));
  }
};

/**
 * Middleware to require admin role
 * Must be used after requireAuth middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AuthError("Authentication required"));
  }

  if (req.user.role !== "admin") {
    return next(new ForbiddenError("Admin access required"));
  }

  next();
};

/**
 * Middleware to require ownership or admin role
 * User can access their own resources, or admin can access any
 * @param {string} paramField - The request param field containing the user ID to check
 */
const requireOwnershipOrAdmin = (paramField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthError("Authentication required"));
    }

    const requestedUserId = req.params[paramField];
    const currentUserId = req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && currentUserId !== requestedUserId) {
      return next(new ForbiddenError("You can only access your own resources"));
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const decoded = extractToken(req.headers.authorization);

    if (decoded) {
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        req.tokenPayload = decoded;
      }
    }
  } catch (error) {
    // Silently continue without user
  }

  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireOwnershipOrAdmin,
  optionalAuth,
};
