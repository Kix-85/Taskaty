const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.middleware');
const { getMyTasks, createTask, getTask, updateTask, deleteTask, createComment, deleteComment} = require('../controllers/task.controller');

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

// Comment routes
router.post('/:taskID/comments', createComment);
router.delete('/:taskID/comments/:commentID', deleteComment);

// Optional: search tasks
// router.get('/search', searchTask);

module.exports = router;
