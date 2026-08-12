module.exports = (bot) => {
  require("./admin")(bot);
  require("./user")(bot);
  require("./text")(bot);
  require("./document")(bot)
};
