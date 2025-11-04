import { query } from '../utils/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export class TaskService {
  // Get all tasks for a user with optional filtering
  static async getTasks(userId, filters = {}) {
    let queryText = 'SELECT * FROM tasks WHERE user_id = $1';
    const queryParams = [userId];

    // Add completed filter if provided
    if (filters.completed !== undefined) {
      queryText += ' AND completed = $2';
      queryParams.push(filters.completed);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, queryParams);

    logger.info(`Retrieved ${result.rows.length} tasks for user ${userId}`);

    return result.rows;
  }

  // Get a single task by ID
  static async getTaskById(taskId, userId) {
    const result = await query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Task not found', 404);
    }

    return result.rows[0];
  }

  // Create a new task
  static async createTask(taskData, userId) {
    const { title, description = '' } = taskData;

    const result = await query(
      'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );

    const task = result.rows[0];

    logger.info(`Task created successfully: ${task.id} by user ${userId}`);

    return task;
  }

  // Update a task
  static async updateTask(taskId, taskData, userId) {
    // First check if task exists and belongs to user
    await this.getTaskById(taskId, userId);

    const { title, description, completed } = taskData;
    const updates = [];
    const params = [];
    let paramCounter = 1;

    // Build dynamic update query
    if (title !== undefined) {
      updates.push(`title = $${paramCounter}`);
      params.push(title);
      paramCounter++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCounter}`);
      params.push(description);
      paramCounter++;
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramCounter}`);
      params.push(completed);
      paramCounter++;
    }

    if (updates.length === 0) {
      throw new AppError('No valid fields provided for update', 400);
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add WHERE conditions
    params.push(taskId, userId);
    const whereClause = `WHERE id = $${paramCounter} AND user_id = $${paramCounter + 1}`;

    const queryText = `UPDATE tasks SET ${updates.join(', ')} ${whereClause} RETURNING *`;

    const result = await query(queryText, params);

    logger.info(`Task updated successfully: ${taskId} by user ${userId}`);

    return result.rows[0];
  }

  // Delete a task
  static async deleteTask(taskId, userId) {
    // First check if task exists and belongs to user
    await this.getTaskById(taskId, userId);

    await query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    logger.info(`Task deleted successfully: ${taskId} by user ${userId}`);

    return { message: 'Task deleted successfully' };
  }

  // Mark task as complete
  static async completeTask(taskId, userId) {
    const result = await this.updateTask(taskId, { completed: true }, userId);
    
    logger.info(`Task marked as complete: ${taskId} by user ${userId}`);
    
    return result;
  }

    // Get task statistics for a user
  static async getTaskStats(userId) {
    const result = await query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN completed = false THEN 1 END) as pending_tasks
      FROM tasks 
      WHERE user_id = $1
    `, [userId]);

    return result.rows[0];
  }
}