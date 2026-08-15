const Payload = require("../../models/Payload");
const isAdmin = require("../../middlewares/isAdmin");
const { deleteFile } = require("../../states");

function deleteDocument(bot) {
  bot.command("deleteDocument", isAdmin, async (ctx) => {
    ctx.reply(
      "آدرس فایلی که می‌خوای حذف بشه رو بفرست\nبرای راحتی کار، فقط بخش بعد از ?start= رو بفرست",
    );
    deleteFile[ctx.from.id] = true;
  });
}

async function getLink(ctx) {
  if (!deleteFile[ctx.from.id]) return false;
  const payload = ctx.message.text.trim();
  const document = await Payload.findOne({ payload });
  if (!document) {
    ctx.reply("این فایل وجود ندارد");
    delete deleteFile[ctx.from.id];
    return false;
  }
  await Payload.deleteOne({ payload });
  ctx.reply("انجام شد");
  delete deleteFile[ctx.from.id];
  return true;
}

module.exports = {
  deleteDocument,
  getLink,
};
