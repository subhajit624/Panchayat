import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../utils/env.js";

const hasCloudinaryConfig =
  Boolean(ENV.CLOUDINARY_CLOUD_NAME) &&
  Boolean(ENV.CLOUDINARY_API_KEY) &&
  Boolean(ENV.CLOUDINARY_API_SECRET);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary, hasCloudinaryConfig };
