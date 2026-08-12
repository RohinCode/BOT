const mongoose = require("mongoose");
const logger = require("../utils/logger");

module.exports = async function () {
  try {
    await mongoose.connect(process.env.MONGO_DB);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", {
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};
