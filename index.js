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
