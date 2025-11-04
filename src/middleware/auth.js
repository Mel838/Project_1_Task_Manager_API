import jwt from 'jsonwebtoken';
import { AppError, catchAsync } from './errorHandler.js';
import { config } from '../config/env.js';
import { query } from '../utils/database.js';
import { logger } from '../utils/logger.js';

// Middleware to protect routes - verify JWT token
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from headers
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to access this resource.', 401));
  }

  // 2) Verify token
  const decoded = jwt.verify(token, config.jwt.secret);

  // 3) Check if user still exists
  const result = await query('SELECT id, username, email FROM users WHERE id = $1', [decoded.id]);
  
  if (result.rows.length === 0) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4) Grant access to protected route
  req.user = result.rows[0];
  logger.info(`User ${req.user.username} authenticated successfully`);
  next();
});

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};