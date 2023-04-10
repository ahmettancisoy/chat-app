const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  createGroupChat,
} = require("../controllers/chatController");

const router = express.Router();

router.use(verifyJWT);
router.route("/").get(getConversations).post(createConversation);
router.route("/group").post(createGroupChat).patch();
// router.route("/group/add").patch();
// router.route("/group/remove").patch();
// router.route("/group/disband").post();
router.route("/getMessages").post(getMessages);
router.route("/sendMessage").post(sendMessage);

module.exports = router;
