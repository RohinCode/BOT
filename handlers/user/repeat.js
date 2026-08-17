const { Markup } = require("telegraf");
const { repeatCount, messageToRepeat } = require("../../states/botState");
const checkChannelMembership = require("../../utils/checkChannelMembership");
let what = {};
let number = {};
let message = {};
let reply = {};
function exitRepeat(userId) {
  delete messageToRepeat[userId];
  delete repeatCount[userId];
  delete message[userId];
  delete number[userId];
  delete reply[userId];
  delete what[userId];
}

function repeatMessage(bot) {
  bot.command("repeat", async (ctx) => {
    if (!(await checkChannelMembership(ctx))) return;
    ctx.reply(
      "هر پیامی که بفرستی، به تعدادی که میخوای تکرار می‌کنم.\nاول انتخاب کن بین متنت از چی استفاده کنم",
      Markup.inlineKeyboard([
        [Markup.button.callback("بین هر متن فاصله بزار", "space")],
        [Markup.button.callback("بعد هر متن برو خط بعدی", "newLine")],
        [Markup.button.callback("بینشون هیچی نزار", "notthing")],
      ]),
    );
  });

  bot.action("space", async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("خوبه، حالا متنی که میخوای تکرار بشه رو بفرست");
    messageToRepeat[ctx.from.id] = true;
    what[ctx.from.id] = " ";
  });
  bot.action("notthing", async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("خوبه، حالا متنی که میخوای تکرار بشه رو بفرست");
    messageToRepeat[ctx.from.id] = true;
    what[ctx.from.id] = "";
  });

  bot.action("newLine", async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("خوبه، حالا متنی که میخوای تکرار بشه رو بفرست");
    messageToRepeat[ctx.from.id] = true;
    what[ctx.from.id] = "\n";
  });
}

function sms(ctx) {
  if (!repeatMessage[ctx.from.id]) return false;
  message[ctx.from.id] = ctx.message.text;
  ctx.reply(
    "خب. حالا تعدادی که می‌خوای متن تکرار بشه رو بفرست.\n(کمتر از 50 باشه و به انگلیسی باشه)\n مثلا: 20",
  );
  delete messageToRepeat[ctx.from.id];
  repeatCount[ctx.from.id] = true;
  return true;
}

function numberOfRepeat(ctx) {
  if (!repeatCount[ctx.from.id]) return false;
  number[ctx.from.id] = Number(ctx.message.text.trim());
  if (!Number.isInteger(number[ctx.from.id])) {
    ctx.reply("عدد وارد کن!");
    exitRepeat(ctx.from.id);
    return false;
  }
  if (number[ctx.from.id] > 50) {
    ctx.reply("عددی کوچیک‌تر از پنجاه انتخاب کن");
    exitRepeat(ctx.from.id);
    return false;
  }
  if (number[ctx.from.id] < 0) {
    ctx.reply("عدد نمی‌تونه منفی باشه");
    exitRepeat(ctx.from.id);
    return false;
  }
  if (number[ctx.from.id] == 0) {
    ctx.reply("عدد نمی‌تونه صفر باشه");
    exitRepeat(ctx.from.id);
    return false;
  }

  reply[ctx.from.id] = "";

  for (let i = 0; i < number[ctx.from.id]; i++) {
    reply[ctx.from.id] += message[ctx.from.id];
    if (i < number[ctx.from.id] - 1) reply[ctx.from.id] += what[ctx.from.id];
  }

  ctx.reply(reply[ctx.from.id]);
  exitRepeat(ctx.from.id);
  return true;
}

module.exports = {
  repeatMessage,
  sms,
  numberOfRepeat,
};
