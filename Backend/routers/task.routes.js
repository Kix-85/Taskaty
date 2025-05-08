const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getAllTasks, createTask, getTask, updateTask, deleteTask,} = require('../controllers/task.controller');

// Ensure that only authenticated users can access them
router.use(verifyToken);

router.get('/me', getMyTasks);

router.post('/me', createTask);

router.get('/:taskID', getTask);

router.put('/:taskID', updateTask);

router.delete('/:taskID', deleteTask);

// Optional: search tasks
// router.get('/search', searchTask);

module.exports = router;
