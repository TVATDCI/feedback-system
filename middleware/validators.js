/**
 * Input Validation Middleware
 * Uses express-validator for request validation
 */

const { body, param, validationResult } = require("express-validator");
const { ValidationError } = require("./errorHandler.js");

/**
 * Helper to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const details = errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
    value: error.value,
  }));

  next(new ValidationError("Validation failed", details));
};

/**
 * User registration validation
 */
const validateCreateUser = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 255 })
    .withMessage("Email must be less than 255 characters"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .isLength({ max: 128 })
    .withMessage("Password must be less than 128 characters"),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Role must be either 'admin' or 'user'"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),

  validate,
];

/**
 * User login validation
 */
const validateLogin = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  validate,
];

/**
 * User update validation
 */
const validateUpdateUser = [
  param("id").isMongoId().withMessage("Invalid user ID format"),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 255 })
    .withMessage("Email must be less than 255 characters"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .isLength({ max: 128 })
    .withMessage("Password must be less than 128 characters"),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Role must be either 'admin' or 'user'"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),

  validate,
];

/**
 * User ID param validation
 */
const validateUserId = [
  param("id").isMongoId().withMessage("Invalid user ID format"),
  validate,
];

/**
 * Feedback creation validation
 */
const validateCreateFeedback = [
  body("message")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be between 1 and 2000 characters"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category must be less than 100 characters"),

  body("status")
    .optional()
    .isIn(["pending", "reviewed", "archived"])
    .withMessage("Status must be 'pending', 'reviewed', or 'archived'"),

  validate,
];

/**
 * Feedback update validation
 */
const validateUpdateFeedback = [
  param("id").isMongoId().withMessage("Invalid feedback ID format"),

  body("message")
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be between 1 and 2000 characters"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category must be less than 100 characters"),

  body("status")
    .optional()
    .isIn(["pending", "reviewed", "archived"])
    .withMessage("Status must be 'pending', 'reviewed', or 'archived'"),

  validate,
];

/**
 * Feedback ID param validation
 */
const validateFeedbackId = [
  param("id").isMongoId().withMessage("Invalid feedback ID format"),
  validate,
];

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateUserId,
  validateCreateFeedback,
  validateUpdateFeedback,
  validateFeedbackId,
};
