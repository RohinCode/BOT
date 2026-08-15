module.exports = (bot) => {
  require("./admin")(bot);
  require("./owner")(bot);
  require("./showUsers")(bot);
  require("./showDocument")(bot);
  const { registerUserStateHandlers } = require("./userManagement");
  const { registerRuleHandlers } = require("./rules");
  const { registerBroadcastHandler } = require("./broadcast");
  const { deleteDocument } = require("./deleteDocument");
  registerBroadcastHandler(bot);
  registerUserStateHandlers(bot);
  registerRuleHandlers(bot);
  deleteDocument(bot);
};
