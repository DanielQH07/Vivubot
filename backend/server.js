import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import iteratorRoutes from './routes/iterator.route.js';
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';
import routeRoutes from './routes/route.route.js';
import destinationRoutes from './routes/destination.route.js';

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
app.use("/api/chat", chatRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/destination", destinationRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})