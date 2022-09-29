const Project = require('../models/project.model');
const Shape = require('../models/shape.model');

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
    return Shape.findOneAndUpdate({ id, project_id }, {
      id,
      project_id,
      data,
      created_by: req.user.id,
    }, { new: true, upsert: true })
      .then(() => res.status(200).send({ message: 'success', success: true }))

      .catch((err) => console.log('err', err));
  } catch (err) {
    return res.json({ message: 'something went wrong', success: false });
  }
};

exports.fetchProjectShape = async (req, res) => {
  const { project_id } = req.query;
  try {
    const data = await Shape.find({ project_id, created_by: req.user.id });
    return res.json({ message: 'success', success: true, data });
  } catch (err) {
    return res.json({ message: 'something went wrong', success: false });
  }
};
