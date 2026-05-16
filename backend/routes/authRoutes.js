import express from "express";
import { body } from "express-validator";
import {
  adminLogin,
  getMe,
  login,
  logout,
  registerCitizen,
  registerWorker,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { WORKER_CATEGORIES } from "../models/User.js";

const router = express.Router();

const baseRegistrationRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
  body("phoneNumber").trim().matches(/^[0-9]{10}$/).withMessage("Use a valid 10 digit phone number."),
  body("wardNumber").isInt({ min: 1 }).withMessage("Ward number is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("gender").optional().isIn(["male", "female", "other", "prefer-not-to-say"]),
];

router.post(
  "/register/citizen",
  upload.single("profilePhoto"),
  baseRegistrationRules,
  validate,
  registerCitizen
);

router.post(
  "/register/worker",
  upload.single("profilePhoto"),
  [
    ...baseRegistrationRules,
    body("category").isIn(WORKER_CATEGORIES).withMessage("Choose a valid worker category."),
    body("experienceYears").optional().isInt({ min: 0 }).withMessage("Experience must be zero or more."),
  ],
  validate,
  registerWorker
);

router.post(
  "/login",
  [
    body("phoneNumber").trim().matches(/^[0-9]{10}$/).withMessage("Use a valid 10 digit phone number."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.post(
  "/admin/login",
  [
    body("phoneNumber").trim().matches(/^[0-9]{10}$/).withMessage("Use a valid 10 digit phone number."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  adminLogin
);

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
