const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getConversations = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  const foundUser = await User.findOne({ email: email });

  if (!foundUser) return res.status(400).json({ message: "Invalid email" });

  const conversations = await Conversation.find({
    participants: foundUser._id,
  })
    .populate("participants", "-password")
    .populate("latestMessage", "text")
    .populate("groupAdmin", "email")
    .lean()
    .exec();

  if (!conversations)
    return res.status(400).json({ message: "No conversations found" });

  res.status(200).json(conversations);
});

const getMessages = asyncHandler(async (req, res) => {
  const { conversation } = req.body;

  if (!conversation)
    return res.status(400).json({ message: "Conversation required" });

  const messages = await Message.find({ conversation })
    .populate("sender", "-password")
    .populate("conversation", "isGroupChat");

  if (!messages)
    return res.status(400).json({ message: "Invalid message data received" });

  res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { email, text, conversation } = req.body;

  if (!email || !text || !conversation)
    return res.status(400).json({ message: "All fields required" });

  const sender = await User.findOne({ email }, "-password").lean().exec();

  if (!sender)
    return res.status(400).json({ message: "Invalid sender data received" });

  let message = await Message.create({
    sender: sender._id,
    text,
    conversation,
  });

  if (!message)
    return res.status(400).json({ message: "Invalid message data received" });

  message = await message.populate("sender", "-password");
  message = await message.populate("conversation");

  const latestMessage = await Conversation.findByIdAndUpdate(conversation, {
    latestMessage: message._id,
  });

  res.status(201).json(message);
});

const createConversation = asyncHandler(async (req, res) => {
  const { email, contactEmail } = req.body;

  if (!contactEmail) return res.status(400).json({ message: "Email required" });

  if (email === contactEmail)
    return res
      .status(400)
      .json({ message: "You can't start conversation with yourself" });

  const participants = await User.find({ email: [email, contactEmail] }, "_id")
    .lean()
    .exec();

  if (participants.length <= 1)
    return res.status(400).json({ message: "User not found" });

  const conversation = await Conversation.findOne({
    isGroupChat: false,
    participants: participants,
  })
    .lean()
    .exec();

  if (conversation)
    return res.status(400).json({ message: "Conversation exists" });

  let newConversation = await Conversation.create({
    participants: participants,
  });

  if (!newConversation)
    return res
      .status(400)
      .json({ message: "Invalid conversation data received" });

  newConversation = await newConversation.populate("participants", "-password");
  newConversation = await newConversation.populate("latestMessage", "text");
  newConversation = await newConversation.populate("groupAdmin", "email");

  res.status(201).json(newConversation);
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { email, participantsEmail, title } = req.body;

  if (!participantsEmail || !title || !email)
    return res.status(400).json({ message: "All fields required" });

  if (participantsEmail.length < 1)
    return res.status(400).json({
      message: "More than 2 participants required to form a group chat",
    });

  participantsEmail.push(email);

  const participants = await User.find(
    { email: participantsEmail },
    "-password"
  )
    .lean()
    .exec();

  if (participants.length <= 1)
    return res.status(400).json({ message: "Invalid participants" });

  let groupAdmin;
  const participantIds = [];

  participants.forEach((participant) => {
    if (participant.email === email) groupAdmin = participant._id;
    participantIds.push(participant._id);
  });

  let groupChat = await Conversation.create({
    isGroupChat: true,
    title: title,
    participants: participantIds,
    groupAdmin: groupAdmin,
  });

  groupChat = await groupChat.populate("participants", "-password");

  if (!groupChat)
    return res
      .status(400)
      .json({ message: "Invalid group chat data received" });

  res.status(201).json(groupChat);
});

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  createGroupChat,
};
