const mongoose = require("mongoose");

const { Schema } = mongoose;

const notificationSchema = new Schema({
  sender_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  receiver_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  post_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Question",
  },
  has_read: {
    type: Boolean,
    default: false,
  },
  noti_type: {
    type: String,
    required: [true, "Noti type not provided."],
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
module.exports = mongoose.model("notification", notificationSchema);
