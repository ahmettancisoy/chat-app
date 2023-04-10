const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const accessTokenTime = "5m";
const refreshTokenTime = "30m";
const maxAge = 30 * 60 * 1000;

const register = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords must match" });
  }

  const userExists = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (userExists) {
    res.status(200).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email,
    password: hashedPassword,
  });

  if (user) {
    const accessToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenTime }
    );

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: refreshTokenTime }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "none", //cross-site cookie
      maxAge: maxAge, //cookie expiry: set to match rT 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      uid: user._id,
      currentUser: user.email,
      accessToken,
      profilePic: user.pic,
      userName: user.name,
    });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword)
    return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenTime }
  );

  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenTime }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "none", //cross-site cookie
    maxAge: maxAge, //cookie expiry: set to match rT 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    uid: user._id,
    currentUser: user.email,
    accessToken,
    profilePic: user.pic,
    userName: user.name,
  });
});

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden verify" });

      const foundUser = await User.findOne({
        email: decoded.email,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          email: foundUser.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: accessTokenTime }
      );

      res.json({
        uid: foundUser._id,
        currentUser: foundUser.email,
        accessToken,
        profilePic: foundUser.pic,
        userName: foundUser.name,
      });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
};

module.exports = { register, login, logout, refresh };
