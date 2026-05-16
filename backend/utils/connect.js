import mongoose from 'mongoose';
import { ENV } from './env.js';
import { ensureDefaultAdmin } from './defaultAdmin.js';

export const connectDB = async () => {
    try {
        if (!ENV.MONGODB_URL) {
            console.warn('MONGODB_URL is missing. Add it to backend/.env before using API data routes.');
            return;
        }
        const conn = await mongoose.connect(ENV.MONGODB_URL);
        console.log('Connected to MongoDB', conn.connection.host);
        await ensureDefaultAdmin();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
