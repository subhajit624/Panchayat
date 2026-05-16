import { User } from "../models/User.js";
import { ENV } from "./env.js";

export const ensureDefaultAdmin = async () => {
  if (ENV.ENABLE_DEFAULT_ADMIN === "false") {
    return;
  }

  const existing = await User.findOne({ phoneNumber: ENV.DEFAULT_ADMIN_PHONE });

  if (existing) {
    if (existing.role !== "admin" || existing.isBlocked) {
      existing.role = "admin";
      existing.isBlocked = false;
      existing.workerApprovalStatus = "approved";
      existing.workerDetails = undefined;
      await existing.save();
    }
    console.log(`Default admin ready: ${ENV.DEFAULT_ADMIN_PHONE}`);
    return;
  }

  await User.create({
    name: ENV.DEFAULT_ADMIN_NAME,
    phoneNumber: ENV.DEFAULT_ADMIN_PHONE,
    password: ENV.DEFAULT_ADMIN_PASSWORD,
    role: "admin",
    workerApprovalStatus: "approved",
    isBlocked: false,
  });

  console.log(`Default admin created: ${ENV.DEFAULT_ADMIN_PHONE}`);
};
