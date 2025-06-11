import express from 'express';
import chatController from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/save-message', chatController.saveMessage);
router.get('/history/:sessionId', chatController.getHistory);
router.get('/sessions', chatController.listSessions);

export default router; 