const User = require("../models/users");

module.exports = async function checkAiLimit(ctx) {
  const user = await User.findOne({
    telegramId: ctx.from.id,
  });

  if (!user) {
    return false;
  }

  // ادمین محدودیت ندارد
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

    await user.save();

    return false;
  }

  user.aiUsage.count++;

  await user.save();

  return true;
};
