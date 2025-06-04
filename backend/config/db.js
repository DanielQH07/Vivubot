import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Use IPv4 explicitly to avoid IPv6 issues
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/Vivubot");
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        console.error("💡 Make sure MongoDB is running locally on port 27017");
        console.error("💡 Start MongoDB service or MongoDB Compass");
        process.exit(1);
    }
};
