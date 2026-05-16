import { CertificateRequest } from "../models/CertificateRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadManyToCloudinary } from "../utils/cloudinaryUpload.js";
import { buildPagination, paginatedResponse } from "../utils/query.js";

export const createCertificateRequest = asyncHandler(async (req, res) => {
  const documents = await uploadManyToCloudinary(req.files, "smart-panchayat/certificate-documents");
  const certificate = await CertificateRequest.create({
    citizen: req.user._id,
    type: req.body.type,
    purpose: req.body.purpose,
    documents,
  });

  res.status(201).json({ message: "Certificate request submitted.", certificate });
});

export const getMyCertificateRequests = asyncHandler(async (req, res) => {
  const certificates = await CertificateRequest.find({ citizen: req.user._id }).sort({ createdAt: -1 });
  res.json({ items: certificates });
});

export const getCertificateRequests = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const [items, total] = await Promise.all([
    CertificateRequest.find(filter)
      .populate("citizen", "name phoneNumber wardNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    CertificateRequest.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const decideCertificateRequest = asyncHandler(async (req, res) => {
  const certificate = await CertificateRequest.findById(req.params.id);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate request not found." });
  }

  certificate.status = req.body.status;
  certificate.remarks = req.body.remarks;
  certificate.decidedBy = req.user._id;
  certificate.decidedAt = new Date();
  await certificate.save();
  await certificate.populate("citizen", "name phoneNumber wardNumber");

  res.json({ message: "Certificate request updated.", certificate });
});
