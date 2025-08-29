import pg from 'pg';
import { config } from '../config/env.js';
import { logger } from './logger.js';

const { Pool } = pg;

// Create PostgreSQL connection pool for better performance
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  max: 10,                    // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30 seconds
});

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Get a client from the pool (for transactions)
export const getClient = () => pool.connect();

// Query helper function - executes SQL queries using the pool
export const query = (text, params) => pool.query(text, params);


// Database initialization - create tables if they don't exist
export const initializeDatabase = async () => {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('Database tables initialized successfully');
  } catch (err) {
    logger.error('Database initialization failed:', err);
    throw err;
  }
};