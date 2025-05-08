const express = require('express');
const router = express.Router();
const { getAllProjects, createProject, updateProject, deleteProject, searchProject } = require('../controllers/project.controller');

router.get('/:userID', getAllProjects);
router.post('/:userID', createProject);
router.get('/:projectID', getProject);
router.put('/:projectID', updateProject);
router.delete('/:projectID', deleteProject);
// apply search if there is a query string in the url  (I will do it later)
// router.get('/search/:projectID', searchProject);

module.exports = router;
