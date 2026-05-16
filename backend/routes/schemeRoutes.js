import express from "express";
import { body } from "express-validator";
import {
  applyForScheme,
  createScheme,
  decideSchemeApplication,
  deleteScheme,
  getMySchemeApplications,
  getSchemeApplications,
  getSchemes,
  updateScheme,
} from "../controllers/schemeController.js";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getSchemes);

router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("title").trim().isLength({ min: 3, max: 150 }),
    body("description").trim().isLength({ min: 10 }),
    body("eligibility").trim().isLength({ min: 5 }),
    body("deadline").optional().isISO8601().withMessage("Use a valid deadline."),
  ],
  validate,
  createScheme
);

router.get("/applications/me", protect, authorize("citizen"), getMySchemeApplications);
router.get("/applications", protect, authorize("admin"), getSchemeApplications);
router.patch(
  "/applications/:id",
  protect,
  authorize("admin"),
  [body("status").isIn(["approved", "rejected"]).withMessage("Invalid decision status.")],
  validate,
  decideSchemeApplication
);

router.post("/:id/apply", protect, authorize("citizen"), upload.array("documents", 6), applyForScheme);
router.patch("/:id", protect, authorize("admin"), updateScheme);
router.delete("/:id", protect, authorize("admin"), deleteScheme);

export default router;
