const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = new Schema({
  created_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "Title not provided."],
  },
  body: {
    type: String,
    required: [true, "Body not provided."],
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
module.exports = mongoose.model("question", questionSchema);
