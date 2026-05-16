import express from "express";
import {
  getAdminAnalytics,
  getCitizenDashboard,
  getWorkerDashboard,
} from "../controllers/dashboardController.js";
import { authorize, protect, requireApprovedWorker } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), getAdminAnalytics);
router.get("/citizen", protect, authorize("citizen"), getCitizenDashboard);
router.get("/worker", protect, requireApprovedWorker, getWorkerDashboard);

export default router;
