import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import iteratorRoutes from './routes/iterator.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối Database
connectDB();

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Middleware để parse JSON từ request body
app.use(express.json());

// Khai báo các routes
app.use("/api/iterator", iteratorRoutes);
app.use("/api/auth", authRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
