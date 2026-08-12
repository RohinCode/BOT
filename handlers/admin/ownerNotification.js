require("dotenv").config();
 OWNER_ID= process.env.OWNER_ID;

async function notifyOwnerAboutAdminRemoval(bot, id, name) {
  await bot.telegram.sendMessage(
    OWNER_ID,
    `
    کاربر
${id}
با اسم: ${name}
داشت سعی می‌کرد تو رو از ادمینی خارج کنه!
    `,
  );
}
async function notifyOwnerAboutBlockAttempt(bot, id, name) {
  await bot.telegram.sendMessage(
    OWNER_ID,
    `
    کاربر
${id}
با اسم: ${name}
داشت سعی می‌کرد تو رو بلاک کنه!
    `,
  );
}

module.exports = {
  notifyOwnerAboutAdminRemoval,
  notifyOwnerAboutBlockAttempt,
};
