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

const certificateRequestSchema = new Schema(
  {
    citizen: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "residence", "caste", "birth-forwarding", "death-forwarding"],
      required: true,
      index: true,
    },
    purpose: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    documents: {
      type: [mediaSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    remarks: String,
    decidedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    decidedAt: Date,
  },
  { timestamps: true }
);

export const CertificateRequest = mongoose.model("CertificateRequest", certificateRequestSchema);
