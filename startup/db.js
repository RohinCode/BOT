const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_DB = process.env.MONGO_DB
module.exports = function () {
  mongoose
    .connect(MONGO_DB)
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log(err));
};
