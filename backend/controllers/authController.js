import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
import { ENV } from "../utils/env.js";

const signToken = (user) => {
  if (!ENV.SECRET_KEY) {
    throw new Error("JWT secret is not configured.");
  }

  return jwt.sign({ id: user._id, role: user.role }, ENV.SECRET_KEY, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user);
  res.status(statusCode).json({ token, user });
};

const parseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.map((skill) => String(skill).trim()).filter(Boolean);
  return String(skills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export const registerCitizen = asyncHandler(async (req, res) => {
  const profilePhoto = await uploadBufferToCloudinary(req.file, "smart-panchayat/profile-photos");

  const user = await User.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    wardNumber: req.body.wardNumber,
    password: req.body.password,
    gender: req.body.gender,
    role: "citizen",
    profilePhoto,
  });

  sendAuth(res, user, 201);
});

export const registerWorker = asyncHandler(async (req, res) => {
  const profilePhoto = await uploadBufferToCloudinary(req.file, "smart-panchayat/profile-photos");

  const user = await User.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    wardNumber: req.body.wardNumber,
    password: req.body.password,
    gender: req.body.gender,
    role: "worker",
    workerApprovalStatus: "pending",
    profilePhoto,
    workerDetails: {
      category: req.body.category,
      skills: parseSkills(req.body.skills),
      experienceYears: Number(req.body.experienceYears) || 0,
      availability: req.body.availability || "available",
    },
  });

  sendAuth(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { phoneNumber, password, role } = req.body;
  const user = await User.findOne({ phoneNumber }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid phone number or password." });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ message: `This account is not registered as ${role}.` });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: "Your account has been blocked." });
  }

  sendAuth(res, user);
});

export const adminLogin = asyncHandler(async (req, res, next) => {
  req.body.role = "admin";
  return login(req, res, next);
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out successfully." });
});
