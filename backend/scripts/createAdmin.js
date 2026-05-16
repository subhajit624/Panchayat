import mongoose from "mongoose";
import { User } from "../models/User.js";
import { ENV } from "../utils/env.js";

const args = process.argv.slice(2).reduce((acc, item, index, arr) => {
  if (item.startsWith("--")) {
    acc[item.slice(2)] = arr[index + 1];
  }
  return acc;
}, {});

const name = args.name || process.env.ADMIN_NAME;
const phoneNumber = args.phone || process.env.ADMIN_PHONE;
const password = args.password || process.env.ADMIN_PASSWORD;

if (!name || !phoneNumber || !password) {
  console.error("Usage: npm run seed:admin -- --name \"Panchayat Admin\" --phone 9999999999 --password StrongPass123");
  process.exit(1);
}

if (!ENV.MONGODB_URL) {
  console.error("MONGODB_URL is required in backend/.env.");
  process.exit(1);
}

await mongoose.connect(ENV.MONGODB_URL);

const existing = await User.findOne({ phoneNumber }).select("+password");

if (existing) {
  existing.name = name;
  existing.password = password;
  existing.role = "admin";
  existing.isBlocked = false;
  existing.workerApprovalStatus = "approved";
  existing.workerDetails = undefined;
  await existing.save();
  console.log(`Admin account updated for ${phoneNumber}.`);
} else {
  await User.create({
    name,
    phoneNumber,
    password,
    role: "admin",
    workerApprovalStatus: "approved",
  });
  console.log(`Admin account created for ${phoneNumber}.`);
}

await mongoose.disconnect();
