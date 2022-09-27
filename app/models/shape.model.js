const mongoose = require('mongoose');

const { Schema } = mongoose;

const shapeSchema = new Schema({
  id: {
    type: String,
    index: true,
    required: true,
    auto: true,
  },
  data: {
    type: mongoose.SchemaTypes.Mixed,
  },
  created_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  project_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Project',
  },
  createdAt: {
    type: Date,
    immutable: true, // it will not let it change anymore
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
module.exports = mongoose.model('shapes', shapeSchema);
