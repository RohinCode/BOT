const { Markup } = require("telegraf");
const { repeatNumber, repeatMessage } = require("../../states/botState");
let what = {};
let number = {};
let message = {};
let reply = {};
function repeaMessage(bot) {
  bot.command("repeat", async (ctx) => {
    ctx.reply(
      "هر پیامی که بفرستی، به تعدادی که میخوای تکرار می‌کنم.\nاول انتخاب کن بین متنت از چی استفاده کنم",
      Markup.inlineKeyboard([
        [Markup.button.callback("بین هر متن فاصله بزار", "space")],
        [Markup.button.callback("بعد هر متن برو خط بعدی", "newLine")],
      ]),
    );
  });

  bot.action("space", async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("خوبه، حالا متنی که میخوای تکرار بشه رو بفرست");
    repeatMessage[ctx.from.id] = true;
    what[ctx.from.id] = " ";
  });

  bot.action("newLine", async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply("خوبه، حالا متنی که میخوای تکرار بشه رو بفرست");
    repeatMessage[ctx.from.id] = true;
    what[ctx.from.id] = "\n";
  });
}

function sms(ctx) {
  if (!repeatMessage[ctx.from.id]) return false;
  message[ctx.from.id] = ctx.message.text;
  ctx.reply(
    "خب. حالا تعدادی که می‌خوای متن تکرار بشه رو بفرست.\n(کمتر از 50 باشه)\n مثلا: 20",
  );
  delete repeatMessage[ctx.from.id];
  repeatNumber[ctx.from.id] = true;
  return true;
}

function numberOfRepeat(ctx) {
  if (!repeatNumber[ctx.from.id]) return false;
  ctx.reply("گرفتمش!");
  number[ctx.from.id] = Number(ctx.message.text.trim());
  if (!Number.isInteger(number[ctx.from.id])) {
    ctx.reply("عدد وارد کن!");
    return false;
  }
  if (number[ctx.from.id] > 50) {
    ctx.reply("عددی کوچیک‌تر از پنجاه انتخاب کن");
    return false;
  }
  if (number[ctx.from.id] < 0) {
    ctx.reply("عدد نمی‌تونه منفی باشه");
    return false;
  }
  if (number[ctx.from.id] == 0) {
    ctx.reply("عدد نمی‌تونه صفر باشه");
    return false;
  }

  reply[ctx.from.id] = "";

  for (let i = 0; i < number[ctx.from.id]; i++) {
    reply[ctx.from.id] += message[ctx.from.id];
    if (i < number[ctx.from.id] - 1) reply[ctx.from.id] += what[ctx.from.id];
  }

  ctx.reply(reply[ctx.from.id]);
  delete message[ctx.from.id];
  delete number[ctx.from.id];
  delete reply[ctx.from.id];
  delete what[ctx.from.id];
  delete repeatNumber[ctx.from.id];
  return true;
}

module.exports = {
  repeaMessage,
  sms,
  numberOfRepeat,
};
