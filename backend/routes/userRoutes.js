import express from "express";
import { body } from "express-validator";
import {
  approveWorker,
  createAdmin,
  getAdmins,
  getPendingWorkers,
  getChatTargets,
  getPublicWorkers,
  getUsers,
  rejectWorker,
  setUserBlocked,
  updateProfile,
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/workers", getPublicWorkers);
router.get("/chat-targets", protect, getChatTargets);
router.patch("/me", protect, upload.single("profilePhoto"), updateProfile);

router.use(protect, authorize("admin"));
router.get("/", getUsers);
router.get("/admins", getAdmins);
router.post(
  "/admins",
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Admin name is required."),
    body("phoneNumber").trim().matches(/^[0-9]{10}$/).withMessage("Use a valid 10 digit phone number."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
    body("gender").optional().isIn(["male", "female", "other", "prefer-not-to-say"]),
  ],
  validate,
  createAdmin
);
router.get("/workers/pending", getPendingWorkers);
router.patch("/workers/:id/approve", approveWorker);
router.patch(
  "/workers/:id/reject",
  [body("rejectionReason").optional().trim().isLength({ max: 500 })],
  validate,
  rejectWorker
);
router.patch(
  "/:id/block",
  [body("isBlocked").isBoolean().withMessage("isBlocked must be true or false.")],
  validate,
  setUserBlocked
);

export default router;
