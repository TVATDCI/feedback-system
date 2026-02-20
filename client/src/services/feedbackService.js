/**
 * Feedback Service
 * Handles feedback API calls
 */

import api from "./api";

/**
 * Get all feedback (admin only)
 * @returns {Promise<Object>} Feedback list with count
 */
export const getAllFeedback = async () => {
  const response = await api.get("/feedback");
  return response.data;
};

/**
 * Get feedback by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Feedback list with count
 */
export const getFeedbackByUser = async (userId) => {
  const response = await api.get(`/feedback/user/${userId}`);
  return response.data;
};

/**
 * Get feedback by ID (admin only)
 * @param {string} id - Feedback ID
 * @returns {Promise<Object>} Feedback object
 */
export const getFeedbackById = async (id) => {
  const response = await api.get(`/feedback/${id}`);
  return response.data;
};

/**
 * Create new feedback
 * @param {Object} feedbackData - Feedback data (message, category)
 * @returns {Promise<Object>} Created feedback
 */
export const createFeedback = async (feedbackData) => {
  const response = await api.post("/feedback", feedbackData);
  return response.data;
};

/**
 * Update feedback (admin only)
 * @param {string} id - Feedback ID
 * @param {Object} feedbackData - Update data
 * @returns {Promise<Object>} Updated feedback
 */
export const updateFeedback = async (id, feedbackData) => {
  const response = await api.patch(`/feedback/${id}`, feedbackData);
  return response.data;
};

/**
 * Delete feedback (admin only)
 * @param {string} id - Feedback ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedback/${id}`);
  return response.data;
};

export default {
  getAllFeedback,
  getFeedbackByUser,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
