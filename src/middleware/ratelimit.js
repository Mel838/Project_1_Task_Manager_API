import Limiter from 'express-limiter';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Create rate limiter (requires Redis for production, uses in-memory for development)
export const createRateLimiter = (app) => {
  // For development, we'll use express-rate-limit instead of express-limiter with Redis
  // In production, you should use Redis with express-limiter for better performance
  
  const rateLimitOptions = {
    windowMs: config.rateLimiting.windowMs,
    max: config.rateLimiting.maxRequests,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the headers
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
      res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later.'
      });
    }
  };

  // Simple in-memory rate limiting for development
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - config.rateLimiting.windowMs;

    // Clean old requests
    if (requests.has(key)) {
      const userRequests = requests.get(key).filter(time => time > windowStart);
      requests.set(key, userRequests);
    } else {
      requests.set(key, []);
    }

    const currentRequests = requests.get(key);

    if (currentRequests.length >= config.rateLimiting.maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      return res.status(429).json(rateLimitOptions.message);
    }

    // Add current request
    currentRequests.push(now);
    requests.set(key, currentRequests);

    next();
  };
};