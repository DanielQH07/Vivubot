import express from 'express';
import { registerUser, loginUser, getPreferences, updatePreferences } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.put('/preferences', authMiddleware, updatePreferences);
router.get('/preferences', authMiddleware, getPreferences);

export default router;
