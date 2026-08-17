const { contactUsers, answerMode } = require("../../states/botState");
const checkChannelMembership = require("../../utils/checkChannelMembership");
const { Markup } = require("telegraf");
require("dotenv").config();
const OWNER_ID = process.env.OWNER_ID;

async function talkWithAmir(ctx, bot) {
  if (!contactUsers[ctx.from.id]) {
    return false;
  }

  if (ctx.message.text === "تموم شد") {
    delete contactUsers[ctx.from.id];

    await ctx.reply("از بخش ارتباط با روهین خارج شدی.");

    return true;
  }

  await bot.telegram.sendMessage(
    OWNER_ID,
    `
  📩 پیام جدید

👤 ${ctx.from.first_name}

🆔 ${ctx.from.username ? "@" + ctx.from.username : "ندارد"}

💬 پیام:

${ctx.message.text}`,
    Markup.inlineKeyboard([
      [Markup.button.callback("پاسخ", `answer_${ctx.from.id}`)],
    ]),
  );

  return true;
}

async function AmirTalkToYou(ctx, bot) {
  if (!answerMode[ctx.from.id]) {
    return false;
  }

  const userId = answerMode[ctx.from.id];

  await bot.telegram.sendMessage(
    userId,
    `
    📩 پاسخ روهین:\n${ctx.message.text}`,
  );

  delete answerMode[ctx.from.id];

  return true;
}

function connect(bot) {
  bot.command("connect", async (ctx) => {
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) return;

    contactUsers[ctx.from.id] = true;

    await ctx.reply(
      "از الان هر پیامی بفرستی برای روهین ارسال میشه.\nبرای خروج «تموم شد» رو بفرست.",
    );
  });

  bot.action(/answer_(.+)/, async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.match[1];

    answerMode[ctx.from.id] = userId;

    await ctx.reply("پاسخ رو بفرست");
  });
}

module.exports = {
  AmirTalkToYou,
  talkWithAmir,
  connect,
};
