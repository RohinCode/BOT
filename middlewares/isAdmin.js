const User = require("../models/Users");

module.exports = async (ctx, next) => {
  const user = await User.findOne({
    telegramId: ctx.from.id,
  });

  if (!user || !user.isAdmin) return;

  ctx.state.user = user;

  await next();
};
