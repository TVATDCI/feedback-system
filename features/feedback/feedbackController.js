/**
 * Feedback Controller
 * HTTP request handling for feedback endpoints
 */

const FeedbackService = require("./feedbackService.js");
const FeedbackRepository = require("./feedbackRepository.js");

// Initialize repository and service
const feedbackRepository = new FeedbackRepository();
const feedbackService = new FeedbackService(feedbackRepository);

/**
 * Get all feedback
 * @route GET /api/feedback
 * @access Admin only
 */
const getAllFeedback = async (req, res, next) => {
  try {
    const result = await feedbackService.getAllFeedback();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single feedback by ID
 * @route GET /api/feedback/:id
 * @access Admin only
 */
const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.id);
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new feedback
 * @route POST /api/feedback
 * @access User or Admin (requires authentication)
 */
const createFeedback = async (req, res, next) => {
  try {
    const feedbackData = {
      ...req.body,
      userId: req.user._id,
    };
    const feedback = await feedbackService.createFeedback(feedbackData);
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

/**
 * Update feedback status
 * @route PATCH /api/feedback/:id
 * @access Admin only
 */
const updateFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.updateFeedback(
      req.params.id,
      req.body,
    );
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete feedback
 * @route DELETE /api/feedback/:id
 * @access Admin only
 */
const deleteFeedback = async (req, res, next) => {
  try {
    const result = await feedbackService.deleteFeedback(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get feedback by user ID
 * @route GET /api/feedback/user/:userId
 * @access User (own feedback) or Admin
 */
const getFeedbackByUser = async (req, res, next) => {
  try {
    const result = await feedbackService.getFeedbackByUser(
      req.params.userId,
      req.user,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByUser,
};
