const logger = require("../utils/logger");

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error("BOT ERROR", {
      message: error.message,
      stack: error.stack,
      userId: ctx.from?.id,
      username: ctx.from?.username,
      updateType: ctx.updateType,
    });

    try {
      await ctx.reply("خطایی در اجرای درخواست رخ داد ❌");
    } catch (replyError) {
      logger.error("FAILED TO SEND ERROR MESSAGE", {
        message: replyError.message,
        stack: replyError.stack,
      });
    }
  }
};