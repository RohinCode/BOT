const { Markup } = require("telegraf");
const User = require("../../models/users");
const OWNER_ID = process.env.OWNER_ID;
const { userAction } = require("../../states/botState");
const {
  notifyOwnerAboutAdminRemoval,
  notifyOwnerAboutBlockAttempt,
} = require("./ownerNotification");
const isAdmin = require("../../middlewares/isAdmin");
const targetUser = {};
const username = {};

function deleteState(ctx) {
  delete userAction[ctx.from.id];
  delete targetUser[ctx.from.id];
  delete username[ctx.from.id];
}

async function findUserByUsername(ctx) {
  username[ctx.from.id] = ctx.message.text;
  if (!username[ctx.from.id].startsWith("@")) {
    ctx.reply("لطفا آیدی کاربر را وارد کنید");
    return false;
  }
  username[ctx.from.id] = username[ctx.from.id].slice(1);

  targetUser[ctx.from.id] = await User.findOne({
    username: username[ctx.from.id],
  });

  if (!targetUser[ctx.from.id]) {
    ctx.reply("کاربر از ربات استفاده نمی‌کند");
    return false;
  }
  return true;
}

function registerUserAction(bot, action) {
  bot.action(action, async (ctx) => {
    await ctx.editMessageText("آیدی کاربر رو بفرست");
    userAction[ctx.from.id] = action;
  });
}

function registerUserStateHandlers(bot) {
  bot.command("userstate", isAdmin, async (ctx) => {
    ctx.reply(
      "می‌خوای چه عملیاتی رو انجام بدی؟ از پایین انتخاب کن \nاینو هم بگم که کاربر مورد نظر باید آیدی داشته باشه. پس اگه آیدی نداره بهش بگو یه آیدی تنظیم کنه",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("ادمین کردن کاربر", "promote"),
          Markup.button.callback("حذف ادمین", "demote"),
        ],
        [
          Markup.button.callback("بلاک کردن کاربر", "block"),
          Markup.button.callback("آن‌بلاک کردن کاربر", "unblock"),
        ],
      ]),
    );
  });

  registerUserAction(bot, "promote");
  registerUserAction(bot, "demote");
  registerUserAction(bot, "block");
  registerUserAction(bot, "unblock");
}

async function promoteUser(ctx) {
  if (userAction[ctx.from.id] !== "promote") {
    return false;
  }
  if (!(await findUserByUsername(ctx))) {
    return false;
  }

  if (targetUser[ctx.from.id].isAdmin) {
    ctx.reply("کاربر از قبل ادمین بود");
    deleteState(ctx);
    return false;
  }

  await User.updateOne(
    { username: username[ctx.from.id] },
    { $set: { isAdmin: true } },
  );
  ctx.reply("انجام شد!");
  deleteState(ctx);
  return true;
}

async function demoteUser(bot, ctx) {
  if (userAction[ctx.from.id] !== "demote") {
    return false;
  }
  if (!(await findUserByUsername(ctx))) {
    deleteState(ctx);
    return false;
  }

  if (!targetUser[ctx.from.id].isAdmin) {
    ctx.reply("کاربر اصلا ادمین نبود!");
    deleteState(ctx);
    return false;
  }
  if (targetUser[ctx.from.id].telegramId === OWNER_ID) {
    ctx.reply(
      "ایشون سازنده‌ی بات هستند. شما نمی‌توانید او را از ادمینی خارج کنید!",
    );
    (notifyOwnerAboutAdminRemoval(
      bot,
      `@${ctx.from.username}`,
      ctx.from.first_name,
    ),
      deleteState(ctx));
    return false;
  }

  await User.updateOne(
    { username: username[ctx.from.id] },
    { $set: { isAdmin: false } },
  );
  ctx.reply("انجام شد!");
  deleteState(ctx);
  return true;
}

async function blockUser(bot, ctx) {
  if (userAction[ctx.from.id] !== "block") {
    return false;
  }
  if (!(await findUserByUsername(ctx))) {
    deleteState(ctx);
    return false;
  }
  if (targetUser[ctx.from.id].isBlocked) {
    ctx.reply("کاربر از قبل بلاک بود");
    deleteState(ctx);
    return false;
  }

  if (targetUser[ctx.from.id].telegramId === OWNER_ID) {
    ctx.reply("ایشون سازنده‌ی بات هستند. شما نمی‌توانید او را بلاک کنید!");
    notifyOwnerAboutBlockAttempt(
      bot,
      `@${ctx.from.username}`,
      ctx.from.first_name,
    );

    deleteState(ctx);
    return false;
  }

  if (targetUser[ctx.from.id].isAdmin) {
    ctx.reply("❌ نمی‌توان یک ادمین را بلاک کرد.");
    deleteState(ctx);
    return false;
  }

  await User.updateOne(
    { username: username[ctx.from.id] },
    { $set: { isBlocked: true } },
  );
  ctx.reply("انجام شد!");
  deleteState(ctx);
  return true;
}

async function unblockUser(ctx) {
  if (userAction[ctx.from.id] !== "unblock") {
    return false;
  }
  if (!(await findUserByUsername(ctx))) {
    deleteState(ctx);
    return false;
  }
  if (!targetUser[ctx.from.id].isBlocked) {
    ctx.reply("کاربر بلاک نبود");
    deleteState(ctx);
    return false;
  }

  await User.updateOne(
    { username: username[ctx.from.id] },
    { $set: { isBlocked: false } },
  );
  ctx.reply("انجام شد!");
  deleteState(ctx);
  return true;
}

module.exports = {
  registerUserStateHandlers,
  promoteUser,
  demoteUser,
  blockUser,
  unblockUser,
};
