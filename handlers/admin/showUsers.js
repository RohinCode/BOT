const User = require("../../models/users");
const isAdmin = require("../../middlewares/isAdmin");
const getUserStatus = require("../../utils/getUserStatus");

module.exports = (bot) => {
  bot.command("showUsers", isAdmin, async (ctx) => {
    const users = await User.find().limit(30).sort({ createAt: -1 });

    let message = "👤 لیست کاربران:\n\n";

    for (const user of users) {
      const username = user.username ? `@${user.username}` : "ندارد";
      const status = getUserStatus(user);
      message += `${username} :آیدی🆔
👤 اسم: ${user.name}
وضعیت: ${status}

`;
    }

    await ctx.reply(message);
  });
};
