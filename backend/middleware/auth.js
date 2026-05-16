import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ENV } from "../utils/env.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token is required." });
    }

    if (!ENV.SECRET_KEY) {
      return res.status(500).json({ message: "JWT secret is not configured." });
    }

    const decoded = jwt.verify(token, ENV.SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to perform this action." });
  }

  next();
};

export const requireApprovedWorker = (req, res, next) => {
  if (req.user.role !== "worker") {
    return res.status(403).json({ message: "Worker access is required." });
  }

  if (req.user.workerApprovalStatus !== "approved") {
    return res.status(403).json({ message: "Your worker profile is not approved yet." });
  }

  next();
};
