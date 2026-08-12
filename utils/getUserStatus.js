function getUserStatus(user) {
  if (user.isAdmin) return "ادمین است";
  if (user.isBlocked) return "بلاک است";

  return "کاربر معمولی";
}

module.exports = getUserStatus;
