import express from "express";
import { body } from "express-validator";
import {
  assignWorker,
  confirmComplaint,
  createComplaint,
  getAllComplaints,
  getAssignedComplaints,
  getComplaint,
  getMyComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { authorize, protect, requireApprovedWorker } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("citizen"),
  upload.single("image"),
  [
    body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title is required."),
    body("description").trim().isLength({ min: 10, max: 2000 }).withMessage("Description is required."),
    body("category").isIn(["water", "electricity", "road", "drainage", "garbage", "streetlight", "other"]),
    body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
  ],
  validate,
  createComplaint
);

router.get("/mine", protect, authorize("citizen"), getMyComplaints);
router.get("/assigned", protect, requireApprovedWorker, getAssignedComplaints);
router.get("/", protect, authorize("admin"), getAllComplaints);
router.get("/:id", protect, getComplaint);

router.patch(
  "/:id/assign",
  protect,
  authorize("admin"),
  [body("workerId").isMongoId().withMessage("Select a valid worker.")],
  validate,
  assignWorker
);

router.patch(
  "/:id/status",
  protect,
  requireApprovedWorker,
  [body("status").isIn(["in-progress", "completed"]).withMessage("Invalid status.")],
  validate,
  updateComplaintStatus
);

router.patch(
  "/:id/confirm",
  protect,
  authorize("citizen"),
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
    body("feedback").optional().trim().isLength({ max: 1000 }),
  ],
  validate,
  confirmComplaint
);

export default router;
