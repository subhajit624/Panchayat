import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
import { buildPagination, escapeRegex, paginatedResponse } from "../utils/query.js";

const userSelect = "-password";

const userFilters = (query) => {
  const filter = {};

  if (query.role) filter.role = query.role;
  if (query.status) filter.workerApprovalStatus = query.status;
  if (query.wardNumber) filter.wardNumber = Number(query.wardNumber);
  if (query.isBlocked === "true") filter.isBlocked = true;
  if (query.isBlocked === "false") filter.isBlocked = false;

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: regex }, { phoneNumber: regex }, { "workerDetails.category": regex }];
  }

  return filter;
};

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = userFilters(req.query);

  const [items, total] = await Promise.all([
    User.find(filter).select(userSelect).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: "admin" })
    .select("name phoneNumber gender isBlocked createdAt")
    .sort({ createdAt: -1 });

  res.json({ items: admins });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ phoneNumber: req.body.phoneNumber });

  if (existing) {
    return res.status(409).json({ message: "An account with this phone number already exists." });
  }

  const admin = await User.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    gender: req.body.gender || "prefer-not-to-say",
    role: "admin",
    workerApprovalStatus: "approved",
    isBlocked: false,
  });

  res.status(201).json({ message: "Admin account created.", admin });
});

export const getPublicWorkers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = {
    role: "worker",
    workerApprovalStatus: "approved",
    isBlocked: false,
  };

  if (req.query.category) filter["workerDetails.category"] = req.query.category;
  if (req.query.availability) filter["workerDetails.availability"] = req.query.availability;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    filter.$or = [
      { name: regex },
      { phoneNumber: regex },
      { "workerDetails.category": regex },
      { "workerDetails.skills": regex },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter).select(userSelect).sort({ "workerDetails.rating": -1, createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const getChatTargets = asyncHandler(async (req, res) => {
  let filter;

  if (req.user.role === "citizen") {
    filter = {
      _id: { $ne: req.user._id },
      isBlocked: false,
      $or: [
        { role: "admin" },
        { role: "worker", workerApprovalStatus: "approved" },
      ],
    };
  } else if (req.user.role === "worker") {
    filter = {
      _id: { $ne: req.user._id },
      isBlocked: false,
      role: { $in: ["admin", "citizen"] },
    };
  } else {
    filter = {
      _id: { $ne: req.user._id },
      isBlocked: false,
      role: { $in: ["citizen", "worker"] },
    };
  }

  const users = await User.find(filter)
    .select("name role phoneNumber wardNumber profilePhoto workerDetails workerApprovalStatus")
    .sort({ role: 1, name: 1 })
    .limit(100);

  res.json({ items: users });
});

export const getPendingWorkers = asyncHandler(async (req, res) => {
  const workers = await User.find({
    role: "worker",
    workerApprovalStatus: "pending",
  })
    .select(userSelect)
    .sort({ createdAt: 1 });

  res.json({ items: workers });
});

export const approveWorker = asyncHandler(async (req, res) => {
  const worker = await User.findOne({ _id: req.params.id, role: "worker" });

  if (!worker) {
    return res.status(404).json({ message: "Worker not found." });
  }

  worker.workerApprovalStatus = "approved";
  worker.approvedBy = req.user._id;
  worker.approvedAt = new Date();
  worker.rejectionReason = undefined;
  await worker.save();

  res.json({ message: "Worker approved.", worker });
});

export const rejectWorker = asyncHandler(async (req, res) => {
  const worker = await User.findOne({ _id: req.params.id, role: "worker" });

  if (!worker) {
    return res.status(404).json({ message: "Worker not found." });
  }

  worker.workerApprovalStatus = "rejected";
  worker.approvedBy = undefined;
  worker.approvedAt = undefined;
  worker.rejectionReason = req.body.rejectionReason || "Application did not meet Panchayat requirements.";
  await worker.save();

  res.json({ message: "Worker rejected.", worker });
});

export const setUserBlocked = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    return res.status(400).json({ message: "You cannot block your own account." });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: Boolean(req.body.isBlocked) },
    { new: true, runValidators: true }
  ).select(userSelect);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({ message: user.isBlocked ? "User blocked." : "User unblocked.", user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name ?? req.user.name,
    wardNumber: req.body.wardNumber ?? req.user.wardNumber,
    gender: req.body.gender ?? req.user.gender,
  };

  if (req.user.role === "worker") {
    updates.workerDetails = {
      ...req.user.workerDetails?.toObject?.(),
      ...req.user.workerDetails,
      category: req.body.category ?? req.user.workerDetails?.category,
      skills: req.body.skills
        ? String(req.body.skills)
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : req.user.workerDetails?.skills,
      experienceYears: req.body.experienceYears ?? req.user.workerDetails?.experienceYears,
      availability: req.body.availability ?? req.user.workerDetails?.availability,
    };
  }

  const profilePhoto = await uploadBufferToCloudinary(req.file, "smart-panchayat/profile-photos");
  if (profilePhoto) updates.profilePhoto = profilePhoto;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select(userSelect);

  res.json({ message: "Profile updated.", user });
});
