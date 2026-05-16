import { Readable } from "node:stream";
import { cloudinary, hasCloudinaryConfig } from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    if (!hasCloudinaryConfig) {
      reject(new Error("Cloudinary is not configured. Please complete the Cloudinary env variables."));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

export const uploadManyToCloudinary = async (files = [], folder) => {
  const uploads = await Promise.all(files.map((file) => uploadBufferToCloudinary(file, folder)));
  return uploads.filter(Boolean);
};
