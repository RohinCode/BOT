const { websiteMode } = require("../../states/botState");
const checkChannelMembership = require("../../utils/checkChannelMembership");
const cheerio = require("cheerio");

function handleWebCommand(bot) {
  bot.command("web", async (ctx) => {
    const isMember = await checkChannelMembership(ctx);
    if (!isMember) return;

    await ctx.reply(
      "این دستور چی‌کار می‌کنه؟\n" +
        "هر لینکی بفرستی، چیزهایی که توی اون صفحه نوشته شده رو می‌فرستم!\n\n" +
        "مثال:\n" +
        "https://example.com/example",
    );

    websiteMode[ctx.from.id] = true;
  });
}

async function handleWebsiteUrl(ctx) {
  if (!websiteMode[ctx.from.id]) return false;

  const websiteUrl = ctx.message.text.trim();

  try {
    const response = await fetch(websiteUrl);

    if (!response.ok) {
      await ctx.reply("نتونستم این صفحه رو دریافت کنم ❌");

      delete websiteMode[ctx.from.id];
      return false;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $("script, style, noscript").remove();

    const text = $("body")
      .find("h1, h2, h3, h4, h5, h6, p, li")
      .map((_, element) => $(element).text().trim())
      .get()
      .filter(Boolean)
      .join("\n\n");

    const links = $("a")
      .map((_, element) => {
        const title = $(element).text().trim();
        const url = $(element).attr("href");

        return {
          title,
          url,
        };
      })
      .get()
      .filter((link) => link.url);

    let result = text || "متن قابل استخراجی پیدا نکردم.";

    // اضافه کردن لینک‌ها
    if (links.length > 0) {
      result += "\n\n🔗 لینک‌ها:\n";

      for (const link of links) {
        result += `\n${link.title || "لینک"}:\n${link.url}`;
      }
    }

    if (result.length > 4000) {
      result = result.slice(0, 4000) + "\n\n... متن بیشتر از حد مجاز بود.";
      return false;
    }

    await ctx.reply(result);

    delete websiteMode[ctx.from.id];

    return true;
  } catch (error) {
    console.error("WEB READER ERROR:", error);

    await ctx.reply("در دریافت یا پردازش این صفحه مشکلی پیش اومد ❌");

    delete websiteMode[ctx.from.id];

    return false;
  }
}

module.exports = {
  handleWebCommand,
  handleWebsiteUrl,
};
