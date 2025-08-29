import express from 'express';
import { TaskController } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate, taskSchema, taskUpdateSchema } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all task routes
router.use(protect);

// Task routes
router.route('/')
  .get(TaskController.getTasks)           // GET /api/tasks - Get all tasks
  .post(validate(taskSchema), TaskController.createTask); // POST /api/tasks - Create task

router.get('/stats', TaskController.getTaskStats); // GET /api/tasks/stats - Get task statistics

router.route('/:id')
  .get(TaskController.getTask)            // GET /api/tasks/:id - Get single task
  .patch(validate(taskUpdateSchema), TaskController.updateTask) // PATCH /api/tasks/:id - Update task
  .delete(TaskController.deleteTask);     // DELETE /api/tasks/:id - Delete task

router.patch('/:id/complete', TaskController.completeTask); // PATCH /api/tasks/:id/complete - Complete task

export default router;