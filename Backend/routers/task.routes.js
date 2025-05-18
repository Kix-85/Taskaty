const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.middleware');
const { 
  getMyTasks, 
  createTask, 
  getTask, 
  updateTask, 
  deleteTask, 
  createComment, 
  deleteComment, 
  getTasksByProject, 
  getTasksByUser,
  createSubtask,
  updateSubtask,
  deleteSubtask
} = require('../controllers/task.controller');

// Ensure that only authenticated users can access them
router.use(verifyToken);

// Get user's tasks
router.get('/me', getMyTasks);

// Create new task
router.post('/', createTask);

// Get specific task
router.get('/:taskID', getTask);

// Update task
router.put('/:taskID', updateTask);

// Delete task
router.delete('/:taskID', deleteTask);

// get tasks by projects
router.get('/project/:projectID', getTasksByProject);

// get tasks by user
router.get('/user/:userID', getTasksByUser);

// Subtask routes
router.post('/:taskID/subtask', createSubtask);
router.put('/:taskID/subtask/:subtaskID', updateSubtask);
router.delete('/:taskID/subtask/:subtaskID', deleteSubtask);

// Comment routes

// create Comment
router.post('/:taskID/comments', createComment);
// Delete comment
router.delete('/:taskID/comments/:commentID', deleteComment);

// Optional: search tasks
// router.get('/search', searchTask);

module.exports = router;
