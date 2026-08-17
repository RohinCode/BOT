const { Markup } = require("telegraf");

module.exports =  async function checkChannelMembership(ctx) {
  const isMember = await ctx.telegram.getChatMember("@RohinCode", ctx.from.id);

  if (isMember.status === "left") {
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
