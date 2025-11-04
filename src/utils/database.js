import pkg from 'pg';
import { config } from '../config/env.js';
import { logger } from './logger.js';

const { Pool } = pkg;

// Create connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Generic query function
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.info(`Query executed in ${duration}ms`);
    return res;
  } catch (error) {
    logger.error('Database query error:', error.message);
    throw error;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Clean up any existing sequences first
    await query('DROP SEQUENCE IF EXISTS users_id_seq CASCADE');
    await query('DROP SEQUENCE IF EXISTS tasks_id_seq CASCADE');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
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
        description TEXT DEFAULT '',
        completed BOOLEAN DEFAULT false,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error.message);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Closing database...');
  pool.end();
});

export default pool;