import { Scheme } from "../models/Scheme.js";
import { SchemeApplication } from "../models/SchemeApplication.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadManyToCloudinary } from "../utils/cloudinaryUpload.js";
import { buildPagination, escapeRegex, paginatedResponse } from "../utils/query.js";

const parseDocs = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((doc) => doc.trim())
    .filter(Boolean);
};

const schemeFilters = (query, includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: regex }, { description: regex }, { eligibility: regex }];
  }
  return filter;
};

export const createScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.create({
    title: req.body.title,
    description: req.body.description,
    eligibility: req.body.eligibility,
    deadline: req.body.deadline,
    requiredDocs: parseDocs(req.body.requiredDocs),
    createdBy: req.user._id,
  });

  res.status(201).json({ message: "Scheme created.", scheme });
});

export const getSchemes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = schemeFilters(req.query, req.user?.role === "admin");

  const [items, total] = await Promise.all([
    Scheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Scheme.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      eligibility: req.body.eligibility,
      deadline: req.body.deadline,
      requiredDocs: req.body.requiredDocs ? parseDocs(req.body.requiredDocs) : undefined,
      isActive: req.body.isActive,
    },
    { new: true, runValidators: true }
  );

  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found." });
  }

  res.json({ message: "Scheme updated.", scheme });
});

export const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found." });
  }

  res.json({ message: "Scheme archived.", scheme });
});

export const applyForScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findOne({ _id: req.params.id, isActive: true });

  if (!scheme) {
    return res.status(404).json({ message: "Scheme not found." });
  }

  const documents = await uploadManyToCloudinary(req.files, "smart-panchayat/scheme-documents");
  const application = await SchemeApplication.create({
    scheme: scheme._id,
    citizen: req.user._id,
    documents,
    note: req.body.note,
  });

  await application.populate("scheme", "title deadline requiredDocs");
  res.status(201).json({ message: "Scheme application submitted.", application });
});

export const getMySchemeApplications = asyncHandler(async (req, res) => {
  const applications = await SchemeApplication.find({ citizen: req.user._id })
    .populate("scheme", "title deadline requiredDocs")
    .sort({ createdAt: -1 });

  res.json({ items: applications });
});

export const getSchemeApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.scheme) filter.scheme = req.query.scheme;

  const [items, total] = await Promise.all([
    SchemeApplication.find(filter)
      .populate("scheme", "title")
      .populate("citizen", "name phoneNumber wardNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    SchemeApplication.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const decideSchemeApplication = asyncHandler(async (req, res) => {
  const application = await SchemeApplication.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: "Application not found." });
  }

  application.status = req.body.status;
  application.remarks = req.body.remarks;
  application.decidedBy = req.user._id;
  application.decidedAt = new Date();
  await application.save();
  await application.populate("scheme", "title");
  await application.populate("citizen", "name phoneNumber wardNumber");

  res.json({ message: "Scheme application updated.", application });
});
