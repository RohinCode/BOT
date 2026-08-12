const User = require("../../models/Users");
const isAdmin = require("../../middlewares/isAdmin");

module.exports = (bot) => {
  bot.command("admin", isAdmin, async (ctx) => {
    await ctx.reply(
      `سلام ${ctx.from.first_name} 👋
لیست دستورات قابل استفاده‌ی ادمین‌ها👤

ارسال پیام همگانی📢
/broadcast

تغییر موقعیت کاربر👨‍💻
/userstate

ساخت دستور ربات🤖
/createRule

حذف دستور ربات🤖
/deleteRule

ادیت دستور ربات🤖
/editRule

نشون دادن کاربران👤
/showUsers
      `,
    );
  });
};
