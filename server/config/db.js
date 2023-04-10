const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  await mongoose.connect(process.env.DB_URL);
};

connectDB()
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

module.exports = connectDB;
