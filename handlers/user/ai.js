const { aiusers } = require("../../states/botState");
const checkChannelMembership = require("../../utils/checkChannelMembership");
const checkAiLimit = require("../../utils/checkAiLimit");
const API_KEY = process.env.API_KEY;

async function ai(ctx) {
  try {
    const waitMsg = await ctx.reply("صبر کنید... ⏳");

    const response = await fetch("https://api.cohere.ai/v2/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-a-03-2025",
        messages: [
          {
            role: "user",
            content: ctx.message.text,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply = data.message?.content?.[0]?.text || "پاسخی دریافت نشد.";

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      waitMsg.message_id,
      undefined,
      reply,
    );
  } catch (err) {
    console.log(err);
    await ctx.reply("خطا در ارتباط با سرور ❌");
  }
}

async function aiMessage(ctx) {
  if (!aiusers[ctx.from.id]) {
    return false;
  }

  if (ctx.message.text === "پایان") {
    delete aiusers[ctx.from.id];

    await ctx.reply("از حالت هوش مصنوعی خارج شدی.");

    return true;
  }

  const allowed = await checkAiLimit(ctx);

  if (!allowed) {
    return true;
  }

  await ai(ctx);

  return true;
}

function rohinGPT(bot) {
  bot.command("rohingpt", async (ctx) => {
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) return;

    aiusers[ctx.from.id] = true;

    await ctx.reply(
      "از الان هر پیامت به هوش مصنوعی ارسال میشه.\nبرای خروج «پایان» رو بفرست.",
    );
  });
}

module.exports = {
  rohinGPT,
  aiMessage,
};
