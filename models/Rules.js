const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema(
  {
    command: { type: String, required: true, unique: true },
    response: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Rule =mongoose.models.Rule|| mongoose.model("Rule", ruleSchema);
module.exports = Rule;
