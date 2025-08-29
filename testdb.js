import { config } from './src/config/env.js';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
});

try {
  const client = await pool.connect();
  console.log('Database connected successfully!');
  client.release();
  process.exit(0);
} catch (err) {
  console.error('Database connection error:', err);
  process.exit(1);
}