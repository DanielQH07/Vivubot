import express from 'express';
import { getDestination } from '../controllers/destination.controller.js';

const router = express.Router();

// POST /api/destination - Lấy thông tin địa danh từ text
router.post('/', getDestination);

export default router; 