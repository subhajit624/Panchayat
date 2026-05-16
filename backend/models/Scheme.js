import mongoose from "mongoose";

const { Schema } = mongoose;

const schemeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    eligibility: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    deadline: Date,
    requiredDocs: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

schemeSchema.index({ title: "text", description: "text", eligibility: "text" });

export const Scheme = mongoose.model("Scheme", schemeSchema);
