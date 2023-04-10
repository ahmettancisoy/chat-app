const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const updateProfilePic = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  const foundUser = await User.findOne({ email: email });

  if (!foundUser) return res.status(400).json({ message: "Invalid email" });

  if (foundUser.pic) {
    const dirPath = path.join(process.cwd(), "/public/images/profiles/");
    fs.unlink(dirPath + foundUser.pic, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }

  const updatedPic = await User.updateOne(
    { email },
    { pic: req.file.filename }
  ).lean();

  if (!updatedPic)
    return res.status(400).json({ message: "Invalid profile data received" });

  res
    .status(200)
    .json({ message: "Profile pic updated", fileName: req.file.filename });
});

const updateProfileName = asyncHandler(async (req, res) => {
  const { email, userName } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  const foundUser = await User.findOne({ email: email });

  if (!foundUser) return res.status(400).json({ message: "Invalid email" });

  const updatedName = await User.updateOne(
    { email },
    { name: userName }
  ).lean();

  if (!updatedName)
    return res.status(400).json({ message: "Invalid profile data received" });

  res.status(200).json({ message: `Username updated as "${userName}"` });
});

module.exports = {
  updateProfilePic,
  updateProfileName,
};
