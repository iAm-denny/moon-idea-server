const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema({
  created_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  project_name: {
    type: String,
    required: [true, 'project name not provided.'],
  },
  project_type: {
    type: String,
    required: [true, 'project_type not provided.'],
  },
  participants: [
    {
      role: String,
      user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      },
    },
  ],
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
module.exports = mongoose.model('project', projectSchema);
