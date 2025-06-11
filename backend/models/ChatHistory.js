import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: String, // 'user' hoặc 'bot'
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  sessionId: String, // ID phiên trò chuyện
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional user reference
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatHistory', chatHistorySchema); 