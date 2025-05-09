const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.middleware');
const { getMyTasks, createTask, getTask, updateTask, deleteTask, createComment, deleteComment} = require('../controllers/task.controller');

// Ensure that only authenticated users can access them
router.use(verifyToken);

router.get('/me', getMyTasks);

router.post('/me', createTask);

router.get('/:taskID', getTask);

router.put('/:taskID', updateTask);

router.delete('/:taskID', deleteTask);

router.post('/create-comment/:taskID', createComment);

router.delete('/delete-comment/:taskID', deleteComment);

// Optional: search tasks
// router.get('/search', searchTask);

module.exports = router;
