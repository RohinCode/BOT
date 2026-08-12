const User = require("../models/Users");
module.exports = async function checkBlock(ctx) {
  const user = await User.findOne({ telegramId: ctx.from.id });

  if (user && user.isBlocked) {
    await ctx.reply("شما دسترسی ندارید.");
    return false;
  }

  return true;
};
