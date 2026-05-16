import express from "express";
import { body } from "express-validator";
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.get("/conversations", getConversations);
router.post(
  "/conversations",
  [body("targetUserId").isMongoId().withMessage("Select a valid user.")],
  validate,
  startConversation
);
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/messages", upload.single("image"), sendMessage);

export default router;
