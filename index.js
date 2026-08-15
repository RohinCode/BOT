require("dotenv").config();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const { Telegraf } = require("telegraf");
const http = require("http");

const db = require("./startup/db");
const syncUser = require("./utils/syncUser");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const checkBlock = require("./utils/checkBlock");

const bot = new Telegraf(process.env.BOT_TOKEN);

const webhookPath = "/telegram/webhook";
const port = process.env.PORT || 3000;

bot.use(errorHandler);

db();

bot.use(async (ctx, next) => {
  await syncUser(ctx);
  if (!(await checkBlock(ctx))) return;
  await next();
});

require("./handlers")(bot);

bot.catch((error, ctx) => {
  logger.error("TELEGRAM BOT ERROR", {
    message: error.message,
    stack: error.stack,
    userId: ctx.from?.id,
    username: ctx.from?.username,
  });
});

const webhookCallback = bot.webhookCallback(webhookPath);

const server = http.createServer((req, res) => {
  if (req.url === webhookPath && req.method === "POST") {
    const secret = req.headers["x-telegram-bot-api-secret-token"];
    if (secret !== WEBHOOK_SECRET) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    return webhookCallback(req, res);
  }

  res.writeHead(200);
  res.end("RohinBot is running!");
});

server.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  const webhookUrl = `https://bot-a0h9.onrender.com${webhookPath}`;

  try {
    await bot.telegram.setWebhook(webhookUrl, {
      secret_token: WEBHOOK_SECRET,
    });

    console.log("Webhook set successfully");

    const info = await bot.telegram.getWebhookInfo();

    console.log("Webhook info:");
    console.log(info);
  } catch (error) {
    logger.error("WEBHOOK SETUP ERROR", {
      message: error.message,
      stack: error.stack,
    });
  }
});
