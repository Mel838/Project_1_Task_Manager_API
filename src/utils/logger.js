import winston from "winston";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../config/env.js";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory where logs will be stored (../logs relative to current file)
const logDir = path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create and export the logger instance
export const logger = winston.createLogger({
  level: config.logging.level,

  // Define how the log messages should be formatted
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  // Meta information that will be attached to every log message
  defaultMeta: { service: 'taskManager-api' },

  // Define where and how to save log messages
  transports: [
    // File transport for logging errors
    new winston.transports.File({
      filename: path.join(logDir, "error.log"), // File to store error-level logs
      level: 'error',                            // Only logs "error" level and above
      maxsize: 5242880                           // Maximum file size (5 MB)
    }),

    // File transport for general application logs
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",                             // Logs "info" level and above (info, warn, error)
      maxsize: 5242880                           // Maximum file size (5 MB)
    })
  ],

  // Handle uncaught exceptions and store them in a separate file
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log')
    })
  ],

  // Handle unhandled promise rejections and store them in a separate file
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log')
    })
  ],

  // Prevent the process from exiting on handled exceptions
  exitOnError: false
});