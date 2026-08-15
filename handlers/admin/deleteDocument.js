const Payload = require("../../models/Payload");
const isAdmin = require("../../middlewares/isAdmin");
const { deleteDocument } = require("../../states");

function deleteDocument(bot) {
  bot.command("deleteDocument", isAdmin, async (ctx) => {
    ctx.reply(
      "آدرس فایلی که می‌خوای حذف بشه رو بفرست\nبرای راحتی کار، فقط بخش بعد از ?start= رو بفرست",
    );
    deleteDocument[ctx.from.id] = true;
  });
}

async function getLink(ctx) {
  if (!deleteDocument[ctx.from.id]) return false;
  const payload = ctx.message.text.trim();
  const document = await Payload.find({ payload });
  if (!document) {
    ctx.reply("این فایل وجود ندارد");
    delete deleteDocument[ctx.from.id];
    return false;
  }
  await Payload.deleteOne({ payload });
  ctx.reply("انجام شد");
  delete deleteDocument[ctx.from.id];
  return true;
}

module.exports = {
  deleteDocument,
  getLink,
};
