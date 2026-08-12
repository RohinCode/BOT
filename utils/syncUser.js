const User = require("../models/Users");

module.exports = async function syncUser(ctx) {
  let user = await User.findOne({
    telegramId: ctx.from.id,
  });

  if (!user) {
    user = new User({
      telegramId: ctx.from.id,
      name: ctx.from.first_name,
      username: ctx.from.username,
    });

    await user.save();
  } else {
    await User.updateOne(
      { telegramId: ctx.from.id },
      { $set: { username: ctx.from.username, name: ctx.from.first_name } },
    );
  }
};
