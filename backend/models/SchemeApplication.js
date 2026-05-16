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

const schemeApplicationSchema = new Schema(
  {
    scheme: {
      type: Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
      index: true,
    },
    citizen: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    documents: {
      type: [mediaSchema],
      default: [],
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000,
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

schemeApplicationSchema.index({ scheme: 1, citizen: 1 }, { unique: true });

export const SchemeApplication = mongoose.model("SchemeApplication", schemeApplicationSchema);
