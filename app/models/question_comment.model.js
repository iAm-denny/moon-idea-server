const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
  created_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: [true, "Content not provided."],
  },
  post_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Question",
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
module.exports = mongoose.model("answer", answerSchema);
