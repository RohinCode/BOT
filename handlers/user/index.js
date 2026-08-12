module.exports = (bot) => {
  require("./start")(bot);
  require("./help")(bot);
  const { connect } = require("./connect");
  const { rohinGPT } = require("./ai");
  connect(bot);
  rohinGPT(bot);
};
