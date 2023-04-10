const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
  updateProfilePic,
  updateProfileName,
} = require("../controllers/userController");
const multer = require("multer");
const upload = multer({
  dest: "./public/images/profiles/",
});

const router = express.Router();

router.use(verifyJWT);

router
  .route("/profile/pic")
  .patch(upload.single("profilePic"), updateProfilePic);

router.route("/profile/name").patch(updateProfileName);

module.exports = router;
