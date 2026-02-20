/**
 * Auth Service
 * Handles authentication API calls
 */

import api from "./api";

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login result with token and user
 */
export const login = async (email, password) => {
  const response = await api.post("/user/login", { email, password });
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile
 */
export const getCurrentUser = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

/**
 * Get all users (admin only)
 * @returns {Promise<Object>} Users list with count
 */
export const getAllUsers = async () => {
  const response = await api.get("/user");
  return response.data;
};

/**
 * Get user by ID (admin only)
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object
 */
export const getUserById = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

/**
 * Create new user (admin only)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  const response = await api.post("/user", userData);
  return response.data;
};

/**
 * Update user (admin only)
 * @param {string} id - User ID
 * @param {Object} userData - Update data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, userData) => {
  const response = await api.patch(`/user/${id}`, userData);
  return response.data;
};

/**
 * Delete user (admin only)
 * @param {string} id - User ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};

export default {
  login,
  getCurrentUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
