const { Markup } = require("telegraf");

module.exports =  async function okOrNo(ctx) {
  const member = await ctx.telegram.getChatMember("@RohinCode", ctx.from.id);

  if (member.status === "left") {
    await ctx.reply(
      `
    برای استفاده باید عضو چنل بشید.
بعد از عضویت دوباره دستور رو وارد کنید.`,
      Markup.inlineKeyboard([
        [Markup.button.url("عضویت در چنل", "https://t.me/RohinCode")],
      ]),
    );
    return false;
  }
  return true;
}