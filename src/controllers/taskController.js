import { TaskService } from '../services/taskService.js';
import { catchAsync } from '../middleware/errorHandler.js';

export class TaskController {
  // Get all tasks for authenticated user
  static getTasks = catchAsync(async (req, res) => {
    const { completed } = req.query;
    const filters = {};

    // Parse completed filter
    if (completed !== undefined) {
      filters.completed = completed === 'true';
    }

    const tasks = await TaskService.getTasks(req.user.id, filters);

    res.status(200).json({
      success: true,
      results: tasks.length,
      data: {
        tasks
      }
    });
  });

  // Get single task by ID
  static getTask = catchAsync(async (req, res) => {
    const task = await TaskService.getTaskById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: {
        task
      }
    });
  });

   // Create new task
  static createTask = catchAsync(async (req, res) => {
    const task = await TaskService.createTask(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task
      }
    });
  });

  // Update task
  static updateTask = catchAsync(async (req, res) => {
    const task = await TaskService.updateTask(req.params.id, req.body, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task
      }
    });
  });

  // Delete task
  static deleteTask = catchAsync(async (req, res) => {
    await TaskService.deleteTask(req.params.id, req.user.id);

    res.status(204).json({
      success: true,
      message: 'Task deleted successfully'
    });
  });

  // Mark task as complete
  static completeTask = catchAsync(async (req, res) => {
    const task = await TaskService.completeTask(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Task marked as complete',
      data: {
        task
      }
    });
  });

  // Get task statistics
  static getTaskStats = catchAsync(async (req, res) => {
    const stats = await TaskService.getTaskStats(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });
  });
}