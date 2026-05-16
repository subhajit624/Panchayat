import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { Schema } = mongoose;

export const WORKER_CATEGORIES = [
  "plumber",
  "electrician",
  "carpenter",
  "mason",
  "cleaner",
  "painter",
  "mechanic",
  "gardener",
];

const mediaSchema = new Schema(
  {
    url: String,
    publicId: String,
    resourceType: String,
    format: String,
  },
  { _id: false }
);

const workerDetailsSchema = new Schema(
  {
    category: {
      type: String,
      enum: WORKER_CATEGORIES,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },
    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    ratingSum: {
      type: Number,
      default: 0,
    },
    totalJobsCompleted: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits."],
    },
    wardNumber: {
      type: Number,
      required() {
        return this.role !== "admin";
      },
      min: 1,
      max: 200,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "citizen", "worker"],
      default: "citizen",
      index: true,
    },
    profilePhoto: mediaSchema,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    workerApprovalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    workerDetails: {
      type: workerDetailsSchema,
      default: undefined,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

userSchema.pre("validate", function setWorkerDefaults() {
  if (this.role === "worker") {
    this.workerApprovalStatus = this.workerApprovalStatus || "pending";
    this.workerDetails = this.workerDetails || {};
  } else {
    this.workerApprovalStatus = "approved";
    this.rejectionReason = undefined;
  }
});

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.index({ name: "text", phoneNumber: "text" });

export const User = mongoose.model("User", userSchema);
