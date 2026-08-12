const {
  createRule,
  executeRule,
  removeRule,
  editRule,
} = require("./admin/rules");
const { aiMessage } = require("./user/ai");
const { sendBroadcast } = require("./admin/broadcast");
const { AmirTalkToYou, talkWithAmir } = require("./user/connect");
const {
  aiusers,
  contactUsers,
  answerMode,
  broadcast,
} = require("../states/botState");
const OWNER_ID = process.env.OWNER_ID;
const {
  demoteUser,
  blockUser,
  unblockUser,
  promoteUser,
} = require("./admin/userManagement");

module.exports = (bot) => {
  bot.on("text", async (ctx) => {
    if (await sendBroadcast(ctx, bot)) return;
    if (await AmirTalkToYou(ctx, bot)) return;
    if (await talkWithAmir(ctx, bot)) return;
    if (await aiMessage(ctx)) return;
    if (await unblockUser(ctx)) return;
    if (await promoteUser(ctx)) return;
    if (await demoteUser(bot, ctx)) return;
    if (await blockUser(bot, ctx)) return;
    if (await createRule(ctx)) return;
    if (await executeRule(ctx)) return;
    if (await removeRule(ctx)) return;
    if (await editRule(ctx)) return;
  });
};
