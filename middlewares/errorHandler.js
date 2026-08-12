async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    console.error("BOT ERROR:", error);

    await ctx.reply("خطایی در اجرای درخواست رخ داد ❌");
  }
}

module.exports = errorHandler;