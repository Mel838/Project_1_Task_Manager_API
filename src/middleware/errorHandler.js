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

// Handle different types of database errors
const handleDatabaseError = (err) => {
  // PostgreSQL duplicate key error
  if (err.code === '23505') {
    const field = err.detail.includes('email') ? 'email' : 'username';
    return new AppError(`User with this ${field} already exists`, 400);
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return new AppError('Referenced record does not exist', 400);
  }

  // PostgreSQL not null violation
  if (err.code === '23502') {
    return new AppError(`Required field ${err.column} is missing`, 400);
  }

  return new AppError('Database error occurred', 500);
};

// Handle JWT errors
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);


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