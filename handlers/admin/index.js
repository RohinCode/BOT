module.exports = (bot) => {
  require("./admin")(bot);
  require("./owner")(bot);
  require("./showUsers")(bot);
  const { registerUserStateHandlers } = require("./userManagement");
  const { registerRuleHandlers } = require("./rules");
  const { registerBroadcastHandler } = require("./broadcast");
  registerBroadcastHandler(bot);
  registerUserStateHandlers(bot);
  registerRuleHandlers(bot);
};
