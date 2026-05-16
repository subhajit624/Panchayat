import express from "express";
import { body } from "express-validator";
import {
  createCertificateRequest,
  decideCertificateRequest,
  getCertificateRequests,
  getMyCertificateRequests,
} from "../controllers/certificateController.js";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("citizen"),
  upload.array("documents", 6),
  [
    body("type").isIn(["income", "residence", "caste", "birth-forwarding", "death-forwarding"]),
    body("purpose").optional().trim().isLength({ max: 1000 }),
  ],
  validate,
  createCertificateRequest
);

router.get("/mine", protect, authorize("citizen"), getMyCertificateRequests);
router.get("/", protect, authorize("admin"), getCertificateRequests);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  [body("status").isIn(["approved", "rejected"]).withMessage("Invalid decision status.")],
  validate,
  decideCertificateRequest
);

export default router;
