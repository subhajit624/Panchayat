import express from "express";
import { body } from "express-validator";
import { predictComplaint } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/complaint-insights",
  protect,
  [
    body("title").optional().trim().isLength({ max: 120 }),
    body("description").optional().trim().isLength({ max: 2000 }),
  ],
  validate,
  predictComplaint
);

export default router;
