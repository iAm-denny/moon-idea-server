const { Router } = require("express");
const verifyToken = require("../../middlewares/authorization");
const {
  createProject,
  fetchProjects,
  shape,
  fetchProjectShape,
  createQuestion,
  fetchQuestion,
  createAnswer,
  fetchAnswer,
  fetchNotification,
  readNotification,
} = require("../controllers/client.controller");

const router = Router();

// client project
router.post("/create-project", verifyToken, createProject);
router.get("/fetch-project", verifyToken, fetchProjects);
router.post("/project-shape", verifyToken, shape);
router.get("/project-shape", verifyToken, fetchProjectShape);
// community
router.post("/create-question", verifyToken, createQuestion);
router.get("/fetch-question", verifyToken, fetchQuestion);
router.post("/create-answer", verifyToken, createAnswer);
router.get("/fetch-answer", verifyToken, fetchAnswer);
// notification
router.get("/fetch-notification", verifyToken, fetchNotification);
router.post("/read-notification", verifyToken, readNotification);

module.exports = router;
