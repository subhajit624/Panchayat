import express from 'express';
import cors from 'cors';
import http from 'node:http';
import { ENV } from './utils/env.js';
import { connectDB } from './utils/connect.js';
import { setupSocket } from './config/socket.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.set('io', io);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
}));

app.get('/', (req, res) => {
  res.json({
    name: 'Smart Panchayat API',
    status: 'running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB();

server.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
