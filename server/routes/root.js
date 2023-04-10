const express = require("express");
const {
  register,
  login,
  logout,
  refresh,
} = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(logout);
router.route("/refresh").get(refresh);

module.exports = router;
