const mongoose = require('mongoose');
const { v4 } = require('uuid');
const Project = require('../models/project.model');
const Shape = require('../models/shape.model');

const { Schema } = mongoose;

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
        return res.status(302).send({ message: err });
      }
      return res.status(200).send({ message: 'success', data });
    });
  } catch (err) {
    return res.json({ message: 'something went wrong', success: false });
  }
};

exports.fetchProjects = async (req, res) => {
  try {
    const data = await Project.find({ created_by: req.user.id }).sort({ createdAt: 'descending' });
    return res.json({ message: 'success', success: true, data });
  } catch (err) {
    return res.json({ message: 'something went wrong', success: false });
  }
};

exports.shape = async (req, res) => {
  const { project_id, data, id } = req.body;
  try {
    const shape = new Shape({
      id,
      project_id,
      data,
      created_by: req.user.id,
    });
    return shape.save(async (err, response) => {
      if (err) {
        return res.status(302).send({ message: err });
      }
      return res.status(200).send({ message: 'success', response });
    });
  } catch (err) {
    return res.json({ message: 'something went wrong', success: false });
  }
};
