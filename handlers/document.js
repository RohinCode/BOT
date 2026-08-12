const crypto = require("crypto");
const Payload = require("../models/Payload");
const OWNER_ID = process.env.OWNER_ID;
const User = require("../models/Users");
const isAdmin = require("../middlewares/isAdmin");
module.exports = (bot) => {
  bot.on("document", isAdmin, async (ctx) => {
    const fileId = ctx.message.document.file_id;
    const payload = crypto.randomBytes(6).toString("hex");

    let file = await new Payload({
      payload,
      fileId,
    });
    await file.save();
    await ctx.reply(
      `فایل ذخیره شد ✅\n\nلینک:\nhttps://t.me/RohinCodeBot?start=${payload}`,
    );
  });
};
