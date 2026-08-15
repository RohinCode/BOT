module.exports = async function syncUser(ctx) {
  const User = require("../models/Users");
  const logger = require("./logger");
  try {
    await User.findOneAndUpdate(
      { telegramId: ctx.from.id },
      {
        $set: {
          username: ctx.from.username,
          name: ctx.from.first_name,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  } catch (error) {
    logger.error("SYNC USER ERROR", {
      message: error.message,
      stack: error.stack,
      userId: ctx.from?.id,
      username: ctx.from?.username,
    });

    throw error;
  }
};
