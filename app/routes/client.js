const { Router } = require('express');
const verifyToken = require('../../middlewares/authorization');
const {
  createProject, fetchProjects, shape, fetchProjectShape,
} = require('../controllers/client.controller');

const router = Router();

router.post('/create-project', verifyToken, createProject);
router.get('/fetch-project', verifyToken, fetchProjects);
router.post('/project-shape', verifyToken, shape);
router.get('/project-shape', verifyToken, fetchProjectShape);

module.exports = router;
