/**
 * Feedback Service
 * Business logic for feedback operations
 */

const {
  NotFoundError,
  ForbiddenError,
} = require("../../middleware/errorHandler.js");
const logger = require("../../utils/logger.js");

class FeedbackService {
  constructor(feedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  /**
   * Get all feedback
   * @returns {Promise<Object>} Object with count and feedback array
   */
  async getAllFeedback() {
    logger.info("Fetching all feedback");
    const feedback = await this.feedbackRepository.findAll();
    logger.info(`Found ${feedback.length} feedback items`);
    return { count: feedback.length, feedback };
  }

  /**
   * Get feedback by ID
   * @param {string} id - Feedback ID
   * @returns {Promise<Object>} Feedback object
   */
  async getFeedbackById(id) {
    logger.info(`Fetching feedback by ID: ${id}`);
    const feedback = await this.feedbackRepository.findById(id);

    if (!feedback) {
      logger.warn(`Feedback not found: ${id}`);
      throw new NotFoundError("Feedback");
    }

    return feedback;
  }

  /**
   * Create new feedback
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise<Object>} Created feedback
   */
  async createFeedback(feedbackData) {
    const { userId, message, category, status } = feedbackData;

    logger.info(`Creating feedback for user: ${userId}`);

    const feedback = await this.feedbackRepository.create({
      userId,
      message,
      category: category || "general",
      status: status || "pending",
    });

    // Populate user info
    await feedback.populate("userId", "email role");

    logger.info(`Feedback created: ${feedback._id}`);
    return feedback;
  }

  /**
   * Update feedback
   * @param {string} id - Feedback ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated feedback
   */
  async updateFeedback(id, updateData) {
    const { message, category, status } = updateData;

    logger.info(`Updating feedback: ${id}`);

    // Build update object
    const data = {};
    if (message !== undefined) data.message = message;
    if (category !== undefined) data.category = category;
    if (status !== undefined) data.status = status;

    const feedback = await this.feedbackRepository.update(id, data);

    if (!feedback) {
      logger.warn(`Feedback update failed - not found: ${id}`);
      throw new NotFoundError("Feedback");
    }

    logger.info(`Feedback updated: ${id}`);
    return feedback;
  }

  /**
   * Delete feedback
   * @param {string} id - Feedback ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteFeedback(id) {
    logger.info(`Deleting feedback: ${id}`);

    const feedback = await this.feedbackRepository.delete(id);

    if (!feedback) {
      logger.warn(`Feedback deletion failed - not found: ${id}`);
      throw new NotFoundError("Feedback");
    }

    logger.info(`Feedback deleted: ${id}`);
    return { message: "Feedback deleted successfully", id };
  }

  /**
   * Get feedback by user ID
   * @param {string} userId - User ID
   * @param {Object} currentUser - Current authenticated user
   * @returns {Promise<Object>} Object with count and feedback array
   */
  async getFeedbackByUser(userId, currentUser) {
    logger.info(`Fetching feedback for user: ${userId}`);

    // Check authorization
    const isOwner = currentUser._id.toString() === userId;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      logger.warn(`Unauthorized feedback access by user: ${currentUser._id}`);
      throw new ForbiddenError("You can only view your own feedback");
    }

    const feedback = await this.feedbackRepository.findByUserId(userId);
    logger.info(`Found ${feedback.length} feedback items for user: ${userId}`);

    return { count: feedback.length, feedback };
  }
}

module.exports = FeedbackService;
