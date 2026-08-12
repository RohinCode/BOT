require("dotenv").config();
require("./startup/db")();
const logger = require("./utils/logger");
const syncUser = require("./utils/syncUser");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const errorHandler = require("./middlewares/errorHandler");

bot.use(errorHandler);

bot.use(async (ctx, next) => {
  await syncUser(ctx);
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

bot
  .launch({
    dropPendingUpdates: true,
  })
  .then(() => {
    logger.info("Telegram bot started successfully");
  })
  .catch((error) => {
    logger.error("Telegram bot failed to start", {
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// HTTP server برای Koyeb
const http = require("http");

const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("RohinBot is running!");
  })
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
