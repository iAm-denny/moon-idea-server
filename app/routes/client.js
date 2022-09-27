const { Router } = require('express');
const verifyToken = require('../../middlewares/authorization');
const { createProject, fetchProjects, shape } = require('../controllers/client.controller');

const router = Router();

router.post('/create-project', verifyToken, createProject);
router.get('/fetch-project', verifyToken, fetchProjects);
router.post('/project-shape', verifyToken, shape);

module.exports = router;
