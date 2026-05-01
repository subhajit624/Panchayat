import express from 'express';
import cors from 'cors';
import { ENV } from './utils/env.js';
import { connectDB } from './utils/connect.js';


const app = express();

app.use(express.json());
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

console.log("MONGO URL:", process.env.MONGODB_URL);
await connectDB();

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});