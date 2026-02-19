/**
 * JWT Utility
 * Handles JWT token generation and verification
 */

import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with id, email, and role
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decode a JWT token without verifying signature
 * Useful for extracting payload from expired tokens
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid format
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Get token expiry time in seconds from now
 * @param {string} expiresIn - JWT expiry string (e.g., "7d", "1h", "30m")
 * @returns {number} Expiry time in seconds
 */
export const getTokenExpirySeconds = (
  expiresIn = process.env.JWT_EXPIRES_IN || "7d",
) => {
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1));

  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * (multipliers[unit] || 1);
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
};
