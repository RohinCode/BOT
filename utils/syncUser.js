const User = require("../models/Users");
const logger = require("./logger");

module.exports = async function syncUser(ctx) {
  const User = require("../models/Users");
  const logger = require("./logger");

  const syncUser = async (ctx) => {
    try {
      let user = await User.findOne({
        telegramId: ctx.from.id,
      });

      if (!user) {
        user = new User({
          telegramId: ctx.from.id,
          name: ctx.from.first_name,
          username: ctx.from.username,
        });

        await user.save();
      } else {
        await User.updateOne(
          { telegramId: ctx.from.id },
          { $set: { username: ctx.from.username, name: ctx.from.first_name } },
        );
      }
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

  module.exports = syncUser;
};
