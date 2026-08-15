const User = require("../../models/Users");
const isAdmin = require("../../middlewares/isAdmin");
const getUserStatus = require("../../utils/getUserStatus");

module.exports = (bot) => {
  bot.command("showUsers", isAdmin, async (ctx) => {
    const users = await User.find().limit(20).sort({ createdAt: -1 });

    let message = "👤 لیست کاربران:\n\n";

    for (const user of users) {
      const username = user.username ? `@${user.username}` : "ندارد";
      const status = getUserStatus(user);
      message += `🆔آیدی: ${username}
👤 اسم: ${user.name}
وضعیت: ${status}\n\n`;
    }

    await ctx.reply(message);
  });
};
