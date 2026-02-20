/**
 * Feedback Repository
 * Abstracts database operations for Feedback model
 */

const Feedback = require("./feedbackModel.js");

class FeedbackRepository {
  constructor(model = Feedback) {
    this.model = model;
  }

  /**
   * Find feedback by ID
   * @param {string} id - Feedback ID
   * @returns {Promise<Object|null>} Feedback with populated user
   */
  async findById(id) {
    return this.model.findById(id).populate("userId", "email role");
  }

  /**
   * Find all feedback
   * @returns {Promise<Array>} Array of feedback with populated users
   */
  async findAll() {
    return this.model
      .find()
      .populate("userId", "email role")
      .sort({ createdAt: -1 });
  }

  /**
   * Find feedback by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of feedback
   */
  async findByUserId(userId) {
    return this.model
      .find({ userId })
      .populate("userId", "email role")
      .sort({ createdAt: -1 });
  }

  /**
   * Create new feedback
   * @param {Object} data - Feedback data
   * @returns {Promise<Object>} Created feedback
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Update feedback by ID
   * @param {string} id - Feedback ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} Updated feedback
   */
  async update(id, data) {
    return this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("userId", "email role");
  }

  /**
   * Delete feedback by ID
   * @param {string} id - Feedback ID
   * @returns {Promise<Object|null>} Deleted feedback
   */
  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  /**
   * Count feedback by user ID
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of feedback
   */
  async countByUserId(userId) {
    return this.model.countDocuments({ userId });
  }

  /**
   * Count all feedback
   * @returns {Promise<number>} Total count
   */
  async countAll() {
    return this.model.countDocuments();
  }
}

module.exports = FeedbackRepository;
