import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const port = config.port;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception! Shutting down...', err);
  process.exit(1);
});

// Start server
const server = app.listen(port, () => {
  logger.info(`Task Manager API running on port ${port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});