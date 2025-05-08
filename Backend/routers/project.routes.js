const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getMyProjects, createProject, getProject, updateProject, deleteProject} = require('../controllers/project.controller');

// Ensure that only authenticated users can access them
router.use(verifyToken);

router.get('/me', getMyProjects);

router.post('/me', createProject);

router.get('/:projectID', getProject);

router.put('/:projectID', updateProject);

router.delete('/:projectID', deleteProject);

// Optional: add search feature later
// router.get('/search', searchProject);

module.exports = router;
