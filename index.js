require("dotenv").config();
console.log("1 - before db");
require("./startup/db")();
console.log("2 - after db");
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

console.log("3 - before handlers");
require("./handlers")(bot);
console.log("4 - after handlers");

bot.catch((error, ctx) => {
  logger.error("TELEGRAM BOT ERROR", {
    message: error.message,
    stack: error.stack,
    userId: ctx.from?.id,
    username: ctx.from?.username,
  });
});

console.log("5 - before launch");
bot
  .launch({
    dropPendingUpdates: true,
  })
  .then(() => {
    console.log("6 - launch completed");
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
