module.exports = (bot) => {
  require("./start")(bot);
  require("./help")(bot);
  const { connect } = require("./connect");
  const { rohinGPT } = require("./ai");
  const { repeaMessage } = require("./repeat");
  connect(bot);
  rohinGPT(bot);
  repeaMessage(bot);
};
