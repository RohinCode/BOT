const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, default: null, index: true },
    telegramId: { type: Number, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    aiMode: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    aiUsage: {
      count: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now },
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
