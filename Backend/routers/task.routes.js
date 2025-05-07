// routes/tasks.js
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/task.controller');

router.get('/', tasksController.getAllTasks);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);
router.get('/search', tasksController.searchTask);

module.exports = router;
