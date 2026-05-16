import { Complaint } from "../models/Complaint.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
import { buildPagination, escapeRegex, paginatedResponse } from "../utils/query.js";

const populateComplaint = [
  { path: "citizenId", select: "name phoneNumber wardNumber profilePhoto" },
  { path: "assignedWorker", select: "name phoneNumber workerDetails profilePhoto" },
];

const complaintFilters = (query) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.wardNumber) filter.wardNumber = Number(query.wardNumber);

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  return filter;
};

export const createComplaint = asyncHandler(async (req, res) => {
  const image = await uploadBufferToCloudinary(req.file, "smart-panchayat/complaints");

  const complaint = await Complaint.create({
    citizenId: req.user._id,
    title: req.body.title,
    description: req.body.description,
    image,
    category: req.body.category,
    priority: req.body.priority || "medium",
    wardNumber: req.user.wardNumber,
  });

  await complaint.populate(populateComplaint);
  res.status(201).json({ message: "Complaint submitted.", complaint });
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = { citizenId: req.user._id, ...complaintFilters(req.query) };

  const [items, total] = await Promise.all([
    Complaint.find(filter).populate(populateComplaint).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = complaintFilters(req.query);

  const [items, total] = await Promise.all([
    Complaint.find(filter).populate(populateComplaint).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const getAssignedComplaints = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = { assignedWorker: req.user._id, ...complaintFilters(req.query) };

  const [items, total] = await Promise.all([
    Complaint.find(filter).populate(populateComplaint).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const getComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate(populateComplaint);

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found." });
  }

  const isCitizenOwner = String(complaint.citizenId?._id || complaint.citizenId) === String(req.user._id);
  const isAssignedWorker = String(complaint.assignedWorker?._id || complaint.assignedWorker) === String(req.user._id);

  if (req.user.role !== "admin" && !isCitizenOwner && !isAssignedWorker) {
    return res.status(403).json({ message: "You cannot view this complaint." });
  }

  res.json({ complaint });
});

export const assignWorker = asyncHandler(async (req, res) => {
  const [complaint, worker] = await Promise.all([
    Complaint.findById(req.params.id),
    User.findOne({
      _id: req.body.workerId,
      role: "worker",
      workerApprovalStatus: "approved",
      isBlocked: false,
    }),
  ]);

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found." });
  }

  if (!worker) {
    return res.status(400).json({ message: "Select an approved worker." });
  }

  complaint.assignedWorker = worker._id;
  complaint.status = complaint.status === "pending" ? "in-progress" : complaint.status;
  await complaint.save();
  await complaint.populate(populateComplaint);

  res.json({ message: "Worker assigned.", complaint });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    assignedWorker: req.user._id,
  });

  if (!complaint) {
    return res.status(404).json({ message: "Assigned complaint not found." });
  }

  const nextStatus = req.body.status;
  const allowed = {
    pending: ["in-progress"],
    "in-progress": ["completed"],
    completed: ["completed"],
    confirmed: [],
  };

  if (!allowed[complaint.status].includes(nextStatus)) {
    return res.status(400).json({ message: `Cannot change status from ${complaint.status} to ${nextStatus}.` });
  }

  complaint.status = nextStatus;
  if (nextStatus === "completed") complaint.resolvedAt = new Date();
  await complaint.save();
  await complaint.populate(populateComplaint);

  res.json({ message: "Complaint status updated.", complaint });
});

export const confirmComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    citizenId: req.user._id,
  });

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found." });
  }

  if (complaint.status !== "completed") {
    return res.status(400).json({ message: "Only completed complaints can be confirmed." });
  }

  complaint.status = "confirmed";
  complaint.confirmedAt = new Date();
  complaint.feedback = {
    text: req.body.feedback,
    rating: Number(req.body.rating),
    submittedAt: new Date(),
  };
  await complaint.save();

  if (complaint.assignedWorker && req.body.rating) {
    const worker = await User.findById(complaint.assignedWorker);
    if (worker?.workerDetails) {
      worker.workerDetails.ratingSum += Number(req.body.rating);
      worker.workerDetails.totalRatings += 1;
      worker.workerDetails.rating = Number(
        (worker.workerDetails.ratingSum / worker.workerDetails.totalRatings).toFixed(1)
      );
      worker.workerDetails.totalJobsCompleted += 1;
      await worker.save();
    }
  }

  await complaint.populate(populateComplaint);
  res.json({ message: "Complaint confirmed and feedback saved.", complaint });
});
