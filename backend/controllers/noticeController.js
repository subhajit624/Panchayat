import { Notice } from "../models/Notice.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
import { buildPagination, escapeRegex, paginatedResponse } from "../utils/query.js";

const noticeFilters = (query, includeDrafts = false) => {
  const filter = includeDrafts ? {} : { isPublished: true };
  if (query.priority) filter.priority = query.priority;
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }
  return filter;
};

export const createNotice = asyncHandler(async (req, res) => {
  const attachment = await uploadBufferToCloudinary(req.file, "smart-panchayat/notices");
  const notice = await Notice.create({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority || "normal",
    isPublished: req.body.isPublished !== "false",
    attachment,
    createdBy: req.user._id,
  });

  res.status(201).json({ message: "Notice created.", notice });
});

export const getNotices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filter = noticeFilters(req.query, req.user?.role === "admin");

  const [items, total] = await Promise.all([
    Notice.find(filter).populate("createdBy", "name").sort({ priority: -1, createdAt: -1 }).skip(skip).limit(limit),
    Notice.countDocuments(filter),
  ]);

  res.json(paginatedResponse(items, total, page, limit));
});

export const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return res.status(404).json({ message: "Notice not found." });
  }

  const attachment = await uploadBufferToCloudinary(req.file, "smart-panchayat/notices");
  notice.title = req.body.title ?? notice.title;
  notice.description = req.body.description ?? notice.description;
  notice.priority = req.body.priority ?? notice.priority;
  notice.isPublished = req.body.isPublished === undefined ? notice.isPublished : req.body.isPublished !== "false";
  if (attachment) notice.attachment = attachment;
  await notice.save();

  res.json({ message: "Notice updated.", notice });
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);

  if (!notice) {
    return res.status(404).json({ message: "Notice not found." });
  }

  res.json({ message: "Notice deleted." });
});
