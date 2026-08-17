const {
  createRule,
  executeRule,
  removeRule,
  editRule,
} = require("./admin/rules");
const { aiMessage } = require("./user/ai");
const { sendBroadcast } = require("./admin/broadcast");
const { getLink } = require("./admin/deleteDocument");
const { AmirTalkToYou, talkWithAmir } = require("./user/connect");
const { sms, numberOfRepeat } = require("./user/repeat");
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

const { handleWebsiteUrl } = require("./user/findWeb");

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
    if (await sms(ctx)) return;
    if (await numberOfRepeat(ctx)) return;
    if (await getLink(ctx)) return;
    if (await handleWebsiteUrl(ctx)) return;
  });
};
