const parseRule = require("../../utils/parseRule");
const { Markup } = require("telegraf");
const { ruleAction } = require("../../states/botState");
const Rule = require("../../models/Rules");
const User = require("../../models/Users");
const isAdmin = require("../../middlewares/isAdmin");

function registerRuleHandlers(bot) {
  bot.command("createRule", isAdmin, async (ctx) => {
    ctx.reply(
      "این دستور برای ساخت دستور هست.\nازت میخوام متن رو به این فرم بفرستی\n /دستور-جواب ارسالی بر دستور",
      Markup.inlineKeyboard([[Markup.button.callback("لغو", "dontDoIt")]]),
    );
    ruleAction[ctx.from.id] = "create";
  });

  bot.command("deleteRule", isAdmin, async (ctx) => {
    ruleAction[ctx.from.id] = "delete";
    await ctx.reply(
      "دستوری که می‌خواهی حذف شود را بفرست.\nمثال:\n/hello",
      Markup.inlineKeyboard([[Markup.button.callback("لغو", "dontDoIt")]]),
    );
  });

  bot.command("editRule", isAdmin, async (ctx) => {
    ctx.reply(
      "این دستور برای ادیت دستور هست.\nازت میخوام متن رو به این فرم بفرستی\n /دستوری که قراره جوابش رو تغییر بدی-جواب ارسالی جدید",
      Markup.inlineKeyboard([[Markup.button.callback("لغو", "dontDoIt")]]),
    );
    ruleAction[ctx.from.id] = "edit";
  });

  bot.action("dontDoIt", async (ctx) => {
    await ctx.answerCbQuery();
    delete ruleAction[ctx.from.id];

    await ctx.reply("لغو شد");
  });
}

async function createRule(ctx) {
  if (ruleAction[ctx.from.id] !== "create") return false;

  const thatIsRepeat = await Rule.findOne({ command });

  if (thatIsRepeat) {
    ctx.reply("این دستور از قبل وجود داشت");
    return false;
  }

  const rule = parseRule(ctx.message.text);

  if (!rule) {
    await ctx.reply("فرمت دستور درست نیست ❌");
    return false;
  }

  await Rule.create(rule);

  delete ruleAction[ctx.from.id];

  await ctx.reply("دستور با موفقیت ساخته شد ✅");
  return true;
}

async function executeRule(ctx) {
  if (ruleAction[ctx.from.id]) return false;
  if (!ctx.message.text.startsWith("/")) return false;
  const rule = await Rule.findOne({
    command: ctx.message.text,
  });
  if (!rule) return false;
  let response = rule.response;
  response = response
    .replace("${ctx.from.id}", ctx.from.id)
    .replace("${ctx.from.username}", ctx.from.username)
    .replace("${ctx.from.first_name}", ctx.from.first_name);

  await ctx.reply(response);
  return true;
}

async function removeRule(ctx) {
  if (ruleAction[ctx.from.id] !== "delete") return false;

  const command = ctx.message.text.trim();

  if (!command.startsWith("/")) {
    await ctx.reply("دستور باید با / شروع شود");
    return false;
  }

  const rule = await Rule.findOne({ command });
  if (!rule) {
    delete ruleAction[ctx.from.id];
    await ctx.reply("این دستور وجود ندارد ❌\n\n از دستور حذف دستور خارج شدید");
    return false;
  }
  await Rule.deleteOne({ command });

  delete ruleAction[ctx.from.id];
  await ctx.reply("دستور با موفقیت حذف شد ✅");
  return true;
}

async function editRule(ctx) {
  if (ruleAction[ctx.from.id] !== "edit") return false;

  const rule = parseRule(ctx.message.text);

  if (!rule) {
    await ctx.reply("فرمت دستور درست نیست ❌");
    return false;
  }

  const existingRule = await Rule.findOne({
    command: rule.command,
  });

  if (!existingRule) {
    delete ruleAction[ctx.from.id];

    await ctx.reply("این دستور وجود ندارد ❌\n\nاز حالت ادیت دستور خارج شدید");

    return false;
  }

  await Rule.updateOne(
    { command: rule.command },
    { $set: { response: rule.response } },
  );

  delete ruleAction[ctx.from.id];

  await ctx.reply("دستور با موفقیت ادیت شد ✅");

  return true;
}

module.exports = {
  registerRuleHandlers,
  createRule,
  executeRule,
  removeRule,
  editRule,
};
