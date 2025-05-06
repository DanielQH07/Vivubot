//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoute from './routes/product.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // use the port from .env file or 5000

app.use(express.json()); // to parse JSON data

app.use("/api/products", productRoute); // use product routes

// Postman desktop app

app.listen(PORT, () => {   
    connectDB();
    console.log('Server is started at http://localhost:5000');
});