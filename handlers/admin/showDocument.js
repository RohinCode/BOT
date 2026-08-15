const Payload = require("../../models/Payload");
const isAdmin = require("../../middlewares/isAdmin");
const getUserStatus = require("../../utils/getUserStatus");

module.exports = (bot) => {
  bot.command("showDocument", isAdmin, async (ctx) => {
    const documents = await Payload.find().limit(20).sort({ createAt: -1 });

    let message = "لیست فایل‌های ذخیره شده\n\n";
    for (const document of documents) {
      let payload = document.payload;
      const username = document;
      message += `آدرس: https://t.me/RohinCodeBot?start=${payload}\n\n`;
    }

    await ctx.reply(message);
  });
};
