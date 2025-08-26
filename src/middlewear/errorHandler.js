import { logger } from "../utils/logger.js";

// Custom error class to handle application-specific errors
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;              // Flag to mark known errors (vs. programming bugs)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // Fail for 4xx, error for 5xx

    // Capture stack trace and associate it with this class
    Error.captureStackTrace(this, this.constructor);
  }
}

// Centralized error-handling middleware
export const errorHandler = (err, req, res, next) => {
  // Create a shallow copy to preserve original error properties
  let error = { ...err };
  error.message = err.message;

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    error: err.stack,
    ip: req.ip 
  });

  // Respond to the client
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Only show stack trace in development
  });
};