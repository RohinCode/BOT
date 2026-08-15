const { broadcast } = require("../../states/botState");
const { Markup } = require("telegraf");
const User = require("../../models/Users");
const isAdmin = require("../../middlewares/isAdmin");

async function sendBroadcast(ctx, bot) {
  if (!(broadcast[ctx.from.id])) {
    return false;
  }

  const users = await User.find({
    telegramId: {
      $ne: ctx.from.id,
    },
  });

  for (const user of users) {
    await bot.telegram.sendMessage(user.telegramId, ctx.message.text);
  }

  delete broadcast[ctx.from.id];

  await ctx.reply("پیام برای همه ارسال شد.");

  return true;
}

function registerBroadcastHandler(bot) {
  bot.command("broadcast",isAdmin, async (ctx) => {
    await ctx.reply(
      `
      با این قابلیت می‌تونی به همه‌ی کسانی که از بات استفاده می‌کنند، پیام بدی
دقت کن پیام حذف نمی‌شه!
خب. پیام رو بفرست`,
      Markup.inlineKeyboard([
        [Markup.button.callback("لغو", "dontSendAMessage")],
      ]),
    );

    broadcast[ctx.from.id] = true;
  });

  bot.action("dontSendAMessage", async (ctx) => {
    await ctx.answerCbQuery();

    delete broadcast[ctx.from.id];

    await ctx.reply("لغو شد");
  });
}

module.exports = {
  registerBroadcastHandler,
  sendBroadcast,
};
