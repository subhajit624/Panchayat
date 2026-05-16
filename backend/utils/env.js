import dotenv from "dotenv";
dotenv.config({quiet: true});

export const ENV = {
    PORT: process.env.PORT || 3000,
    MONGODB_URL: process.env.MONGODB_URL,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    SECRET_KEY: process.env.SECRET_KEY,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    ENABLE_DEFAULT_ADMIN: process.env.ENABLE_DEFAULT_ADMIN ?? "true",
    DEFAULT_ADMIN_NAME: process.env.DEFAULT_ADMIN_NAME || "Smart Panchayat Admin",
    DEFAULT_ADMIN_PHONE: process.env.DEFAULT_ADMIN_PHONE || "9999999999",
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@12345",
}
