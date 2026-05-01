import dotenv from "dotenv";
dotenv.config({quiet: true});

export const ENV = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SECRET_KEY: process.env.SECRET_KEY,
}