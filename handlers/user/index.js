module.exports = (bot) => {
  require("./start")(bot);
  require("./help")(bot);
  const { connect } = require("./connect");
  const { rohinGPT } = require("./ai");
  const { repeatMessage } = require("./repeat");
  connect(bot);
  rohinGPT(bot);
  repeatMessage(bot);
};
