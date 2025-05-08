const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, updateTask, deleteTask, searchTask } = require('../controllers/task.controller');

router.get('/:userID', getAllTasks);
router.post('/:userID', createTask);
router.get('/:taskID', getTask); // Assuming you have a function to get a task by ID
router.put('/:taskID', updateTask);
router.delete('/:taskID', deleteTask);
// apply search if there is a query string in the url  (I will do it later) or search by name only still not implemented
// router.get('/search/:taskID', searchTask);

module.exports = router;
