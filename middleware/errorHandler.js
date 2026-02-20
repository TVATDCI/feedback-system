/**
 * Error Handling Middleware
 * Centralized error handling with custom error classes
 */

/**
 * Custom Application Error class
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error class
 */
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

/**
 * Authentication Error class
 */
class AuthError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTH_ERROR");
  }
}

/**
 * Authorization Error class
 */
class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "FORBIDDEN");
  }
}

/**
 * Not Found Error class
 */
class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

/**
 * Conflict Error class (e.g., duplicate entry)
 */
class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(`[Error] ${err.message}`);
  if (err.stack && process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Handle known operational errors
  if (err.isOperational) {
    const response = {
      error: err.errorCode,
      message: err.message,
    };

    // Add validation details if available
    if (err.details && err.details.length > 0) {
      response.details = err.details;
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Validation failed",
      details,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: "CONFLICT",
      message: `${field} already exists`,
    });
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "AUTH_ERROR",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "AUTH_ERROR",
      message: "Token expired",
    });
  }

  // Unknown error - don't leak details in production
  return res.status(500).json({
    error: "INTERNAL_ERROR",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
};

/**
 * 404 handler for unknown routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: `Route ${req.method} ${req.path} not found`,
  });
};

module.exports = {
  AppError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  errorHandler,
  notFoundHandler,
};
