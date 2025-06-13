import express from 'express';
import { calculateRoute } from '../controllers/route.controller.js';

const router = express.Router();

router.post('/', calculateRoute);

export default router; 