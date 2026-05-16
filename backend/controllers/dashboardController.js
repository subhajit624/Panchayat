import { CertificateRequest } from "../models/CertificateRequest.js";
import { Complaint } from "../models/Complaint.js";
import { Notice } from "../models/Notice.js";
import { SchemeApplication } from "../models/SchemeApplication.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeWorkers,
    pendingApprovals,
    completedComplaints,
    schemeApplications,
    certificateRequests,
    complaintsByCategory,
    wardWiseComplaints,
    complaintsByStatus,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    User.countDocuments({ role: "worker", workerApprovalStatus: "approved", isBlocked: false }),
    User.countDocuments({ role: "worker", workerApprovalStatus: "pending" }),
    Complaint.countDocuments({ status: "confirmed" }),
    SchemeApplication.countDocuments(),
    CertificateRequest.countDocuments(),
    Complaint.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Complaint.aggregate([{ $group: { _id: "$wardNumber", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  res.json({
    cards: {
      totalUsers,
      activeWorkers,
      pendingApprovals,
      completedComplaints,
      schemeApplications,
      certificateRequests,
    },
    complaintsByCategory,
    wardWiseComplaints,
    complaintsByStatus,
  });
});

export const getCitizenDashboard = asyncHandler(async (req, res) => {
  const [complaints, schemeApplications, certificates, notices] = await Promise.all([
    Complaint.find({ citizenId: req.user._id }).sort({ createdAt: -1 }).limit(5).populate("assignedWorker", "name"),
    SchemeApplication.find({ citizen: req.user._id }).populate("scheme", "title").sort({ createdAt: -1 }).limit(5),
    CertificateRequest.find({ citizen: req.user._id }).sort({ createdAt: -1 }).limit(5),
    Notice.find({ isPublished: true }).sort({ priority: -1, createdAt: -1 }).limit(5),
  ]);

  const counts = await Complaint.aggregate([
    { $match: { citizenId: req.user._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json({ complaints, schemeApplications, certificates, notices, counts });
});

export const getWorkerDashboard = asyncHandler(async (req, res) => {
  const [assignedComplaints, counts] = await Promise.all([
    Complaint.find({ assignedWorker: req.user._id })
      .populate("citizenId", "name wardNumber phoneNumber")
      .sort({ createdAt: -1 })
      .limit(8),
    Complaint.aggregate([
      { $match: { assignedWorker: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    assignedComplaints,
    counts,
    workerDetails: req.user.workerDetails,
  });
});
