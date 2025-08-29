import express from 'express';

const router = express.Router();

/* GET home page - API information */
router.get('/', function(req, res, next) {
  res.status(200).json({
    success: true,
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout'
      },
      tasks: {
        getTasks: 'GET /api/tasks',
        createTask: 'POST /api/tasks',
        getTask: 'GET /api/tasks/:id',
        updateTask: 'PATCH /api/tasks/:id',
        deleteTask: 'DELETE /api/tasks/:id',
        completeTask: 'PATCH /api/tasks/:id/complete',
        getStats: 'GET /api/tasks/stats'
      }
    }
  });
});

export default router;