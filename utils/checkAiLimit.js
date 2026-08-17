const User = require("../models/Users");

module.exports = async function checkAiLimit(ctx) {
  const user = await User.findOne({
    telegramId: ctx.from.id,
  });

  if (!user) {
    return false;
  }

  if (user.isAdmin) {
    return true;
  }

  const now = new Date();

  const oneDay = 24 * 60 * 60 * 1000;

  if (now - user.aiUsage.lastReset >= oneDay) {
    user.aiUsage.count = 0;
    user.aiUsage.lastReset = now;
  }

  if (user.aiUsage.count >= 10) {
    await ctx.reply(
      "خیلی شرمنده. اما نمی‌تونی روزانه بیشتر از 10 پیام به هوش مصنوعی بدی! \nفردا دوباره امتحان کن",
    );
    return false;
  }

  user.aiUsage.count++;

  await user.save();

  return true;
};
