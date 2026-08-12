const mongoose = require("mongoose");

const payloadSchema = new mongoose.Schema({
  payload: {
    type: String,
    unique: true,
    required: true,
  },

  fileId: {
    type: String,
    required: true,
  },
});

const Payload = mongoose.models.File|| mongoose.model("File", payloadSchema);

module.exports = Payload;