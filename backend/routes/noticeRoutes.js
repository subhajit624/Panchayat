import express from "express";
import { body } from "express-validator";
import {
  createNotice,
  deleteNotice,
  getNotices,
  updateNotice,
} from "../controllers/noticeController.js";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getNotices);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("attachment"),
  [
    body("title").trim().isLength({ min: 3, max: 140 }).withMessage("Title is required."),
    body("description").trim().isLength({ min: 10, max: 3000 }).withMessage("Description is required."),
    body("priority").optional().isIn(["normal", "important", "urgent"]),
  ],
  validate,
  createNotice
);

router.patch("/:id", protect, authorize("admin"), upload.single("attachment"), updateNotice);
router.delete("/:id", protect, authorize("admin"), deleteNotice);

export default router;
