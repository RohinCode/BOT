require("dotenv").config();
require("./startup/db")();

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

bot.launch();

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
