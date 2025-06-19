import express from 'express';
import { getDestination, getDestinations } from '../controllers/destination.controller.js';

const router = express.Router();

// POST /api/destination - Lấy thông tin địa danh từ placeName
router.post('/', getDestination);
// POST /api/destination/multi - Lấy nhiều địa danh từ prompt
router.post('/multi', getDestinations);

export default router; 