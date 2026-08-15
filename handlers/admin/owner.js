const User = require("../../models/Users");
require("dotenv").config();
const OWNER_ID = process.env.OWNER_ID;

module.exports = (bot) => {
  bot.command("showAdmins", async (ctx) => {
    if (String(ctx.from.id) !== OWNER_ID) return;

    const users = await User.find({ isAdmin: true });

    let message = "👑 لیست ادمین‌ها:\n\n";

    for (const user of users) {
      const username = user.username ? `@${user.username}` : "ندارد";

      message += `${username} :آیدی🆔
👤 اسم: ${user.name}\n\n`;
    }

    await ctx.reply(message);
  });
};
