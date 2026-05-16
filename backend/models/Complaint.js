import mongoose from "mongoose";

const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    url: String,
    publicId: String,
    resourceType: String,
    format: String,
  },
  { _id: false }
);

const feedbackSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    submittedAt: Date,
  },
  { _id: false }
);

const complaintSchema = new Schema(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    image: mediaSchema,
    category: {
      type: String,
      enum: ["water", "electricity", "road", "drainage", "garbage", "streetlight", "other"],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    wardNumber: {
      type: Number,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "confirmed"],
      default: "pending",
      index: true,
    },
    assignedWorker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    resolvedAt: Date,
    confirmedAt: Date,
    feedback: feedbackSchema,
  },
  { timestamps: true }
);

complaintSchema.index({ title: "text", description: "text" });

export const Complaint = mongoose.model("Complaint", complaintSchema);
