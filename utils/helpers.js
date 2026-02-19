/**
 * Utility Helper Functions
 * Common utility functions used across the application
 */

/**
 * Format a MongoDB ObjectId to string
 * @param {ObjectId} id - MongoDB ObjectId
 * @returns {string} String representation of the ID
 */
export const formatId = (id) => {
  return id ? id.toString() : null;
};

/**
 * Check if a string is a valid MongoDB ObjectId format
 * @param {string} id - String to check
 * @returns {boolean} True if valid ObjectId format
 */
export const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Remove sensitive fields from user object
 * @param {Object} user - User object
 * @returns {Object} User object without sensitive fields
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  return sanitized;
};

/**
 * Create a standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @returns {Object} Formatted response object
 */
export const apiResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) {
    response.data = data;
  }
  return response;
};

export default {
  formatId,
  isValidObjectId,
  sanitizeUser,
  apiResponse,
};
