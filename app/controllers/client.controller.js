const Project = require("../models/project.model");
const Notification = require("../models/notification.model");
const Shape = require("../models/shape.model");
const Question = require("../models/question.model");
const Answer = require("../models/question_comment.model");

exports.createProject = (req, res) => {
  const { project_name, project_type } = req.body;
  try {
    const project = new Project({
      project_name,
      project_type,
      created_by: req.user.id,
      participants: [],
    });
    return project.save(async (err, data) => {
      if (err) {
        return res.status(302).send({ success: false, message: err });
      }
      return res.status(200).send({ message: "success", success: true, data });
    });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.fetchProjects = async (req, res) => {
  try {
    const data = await Project.find({ created_by: req.user.id }).sort({
      createdAt: "descending",
    });
    return res.json({ message: "success", success: true, data });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.shape = async (req, res) => {
  const { project_id, data, id } = req.body;
  try {
    return Shape.findOneAndUpdate(
      { id, project_id },
      {
        id,
        project_id,
        data,
        created_by: req.user.id,
      },
      { new: true, upsert: true }
    )
      .then(() => res.status(200).send({ message: "success", success: true }))

      .catch((err) => console.log("err", err));
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.fetchProjectShape = async (req, res) => {
  const { project_id } = req.query;
  try {
    const data = await Shape.find({ project_id, created_by: req.user.id });
    return res.json({ message: "success", success: true, data });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.createQuestion = async (req, res) => {
  const { title, body } = req.body;
  try {
    const question = new Question({
      title,
      body,
      created_by: req.user.id,
    });
    return question.save(async (err, data) => {
      if (err) {
        return res.status(302).send({ success: false, message: err });
      }
      return res.status(200).send({ message: "success", success: true, data });
    });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.fetchQuestion = async (req, res) => {
  const { post_id } = req.query;
  try {
    if (post_id) {
      const data = await Question.findById(post_id)
        .sort({
          createdAt: "descending",
        })
        .populate({
          path: "created_by",
          model: "User",
          select: "id fullname profile",
        });
      return res.json({ message: "success", success: true, data });
    }
    const data = await Question.find()
      .sort({
        createdAt: "descending",
      })
      .populate({
        path: "created_by",
        model: "User",
        select: "id fullname profile",
      });
    return res.json({ message: "success", success: true, data });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.createAnswer = async (req, res) => {
  const { content, post_id, post_owner_id } = req.body;
  try {
    const answer = new Answer({
      content,
      post_id,
      created_by: req.user.id,
    });

    return answer.save(async (err, data) => {
      if (err) {
        return res.status(302).send({ success: false, message: err });
      }
      if (post_owner_id !== req.user.id) {
        await Notification.create({
          noti_type: "comment",
          post_id,
          sender_id: req.user.id,
          receiver_id: post_owner_id,
        });
      }

      return res.status(200).send({ message: "success", success: true, data });
    });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.fetchAnswer = async (req, res) => {
  const { post_id } = req.query;
  try {
    const data = await Answer.find({ post_id })
      .sort({
        createdAt: "descending",
      })
      .populate({
        path: "created_by",
        model: "User",
        select: "id fullname profile",
      });
    return res.json({ message: "success", success: true, data });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.fetchNotification = async (req, res) => {
  try {
    const data = await Notification.find()
      .sort({
        createdAt: "descending",
      })
      .populate({
        path: "sender_id",
        model: "User",
        select: "id fullname profile",
      });
    return res.json({ message: "success", success: true, data });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};

exports.readNotification = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        receiver_id: req.user.id,
        has_read: false,
      },
      { has_read: true }
    );
    return res.json({ message: "success", success: true });
  } catch (err) {
    return res.json({ message: "something went wrong", success: false });
  }
};
