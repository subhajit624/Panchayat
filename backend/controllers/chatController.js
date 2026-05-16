import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

const populateConversation = [
  { path: "participants", select: "name role profilePhoto workerApprovalStatus" },
  { path: "lastMessage" },
];

const findOrCreateConversation = async (userId, targetUserId) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, targetUserId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [userId, targetUserId] });
  }

  return conversation;
};

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate(populateConversation)
    .sort({ updatedAt: -1 });

  const unreadCounts = await Message.aggregate([
    {
      $match: {
        receiver: req.user._id,
        readAt: { $exists: false },
      },
    },
    { $group: { _id: "$conversation", count: { $sum: 1 } } },
  ]);

  const unreadByConversation = unreadCounts.reduce((acc, item) => {
    acc[String(item._id)] = item.count;
    return acc;
  }, {});

  res.json({
    items: conversations.map((conversation) => ({
      ...conversation.toObject(),
      unreadCount: unreadByConversation[String(conversation._id)] || 0,
    })),
  });
});

export const startConversation = asyncHandler(async (req, res) => {
  const target = await User.findById(req.body.targetUserId).select("name role isBlocked workerApprovalStatus");

  if (!target || target.isBlocked) {
    return res.status(404).json({ message: "User is not available for chat." });
  }

  const canChatWithTarget =
    req.user.role === "admin" ||
    target.role === "admin" ||
    (req.user.role === "citizen" && target.role === "worker" && target.workerApprovalStatus === "approved") ||
    (req.user.role === "worker" && target.role === "citizen");

  if (!canChatWithTarget) {
    return res.status(403).json({ message: "This chat is not allowed." });
  }

  const conversation = await findOrCreateConversation(req.user._id, target._id);
  await conversation.populate(populateConversation);

  res.status(201).json({ conversation });
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found." });
  }

  const messages = await Message.find({ conversation: conversation._id })
    .populate("sender", "name role profilePhoto")
    .populate("receiver", "name role profilePhoto")
    .sort({ createdAt: 1 });

  await Message.updateMany(
    { conversation: conversation._id, receiver: req.user._id, readAt: { $exists: false } },
    { readAt: new Date() }
  );

  res.json({ items: messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, receiverId, text } = req.body;
  let conversation;

  if (conversationId) {
    conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });
  } else if (receiverId) {
    conversation = await findOrCreateConversation(req.user._id, receiverId);
  }

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found." });
  }

  const receiver = conversation.participants.find((participant) => String(participant) !== String(req.user._id));
  const image = await uploadBufferToCloudinary(req.file, "smart-panchayat/chat-images");

  if (!text && !image) {
    return res.status(400).json({ message: "Message text or image is required." });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    receiver,
    text,
    image,
  });

  conversation.lastMessage = message._id;
  await conversation.save();
  await message.populate("sender", "name role profilePhoto");
  await message.populate("receiver", "name role profilePhoto");

  req.app.get("io")?.to(String(receiver)).emit("message:new", message);
  req.app.get("io")?.to(String(req.user._id)).emit("message:new", message);

  res.status(201).json({ message: "Message sent.", item: message });
});
