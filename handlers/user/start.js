const { Markup } = require("telegraf");
const Payload = require("../../models/Payload");
const okOrNo = require("../../utils/okOrNo");
function welcomeMessage(name) {
  return `
خوش اومدی ${name}🤝

امیدوارم این ربات به دردت بخوره.
می‌تونی تو منو لیست دستورات رو ببینی.
`;
}

module.exports = (bot) => {
  bot.start(async (ctx) => {
    try {
      const payload = ctx.startPayload;

      if (payload) {
        if (!(await okOrNo(ctx))) return;
        const file = await Payload.findOne({ payload });
        if (!file) {
          ctx.reply("این فایل وجود ندارد");
          return;
        }
        await ctx.replyWithDocument(file.fileId);
        return;
      }

      await ctx.reply(
        welcomeMessage(ctx.from.first_name),
        Markup.inlineKeyboard([
          [Markup.button.callback("من کی هستم؟👨‍💻", "about")],
          [Markup.button.callback("چنل و بات‌های من", "channel")],
        ]),
      );
    } catch (error) {
      console.log(error);
      await ctx.reply("خطایی رخ داد ❌");
    }
  });

  bot.action("about", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      `
من روهینم. به معنی روشن✨️

یه برنامه نویس 👨‍💻

ما اینجاییم که باهم مهارت‌هامون رو ارتقا بدیم 🤝
`,
      Markup.inlineKeyboard([
        [
          Markup.button.url("گیت‌هاب من", "https://github.com/RohinCode"),
          Markup.button.url("اینستای من", "https://instagram.com/RohinCode"),
        ],
        [Markup.button.callback("برگشت🔙", "back")],
      ]),
    );
  });

  bot.action("channel", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "چنل‌ها و ربات‌های من🫴",
      Markup.inlineKeyboard([
        [Markup.button.url("چنل", "https://t.me/RohinCode")],
        [Markup.button.url("ربات دانلودر", "https://t.me/DownloadRohinbot")],
        [Markup.button.callback("برگشت🔙", "back")],
      ]),
    );
  });

  bot.action("back", async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      welcomeMessage(ctx.from.first_name),
      Markup.inlineKeyboard([
        [Markup.button.callback("من کی هستم؟👨‍💻", "about")],
        [Markup.button.callback("چنل و بات‌های من", "channel")],
      ]),
    );
  });
};
