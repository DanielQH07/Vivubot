import ChatHistory from '../models/ChatHistory.js';

// Lưu message vào lịch sử
const saveMessage = async (req, res) => {
  const { sessionId, sender, message, userId } = req.body;
  if (!sessionId || !sender || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    let chat = await ChatHistory.findOne({ sessionId });
    if (!chat) {
      chat = new ChatHistory({ sessionId, messages: [], user: userId || undefined });
    }
    // Nếu userId được truyền vào và chưa có trong chat, cập nhật
    if (userId && !chat.user) {
      chat.user = userId;
    }
    chat.messages.push({ sender, message });
    await chat.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// Lấy lịch sử trò chuyện theo sessionId
const getHistory = async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  try {
    const chat = await ChatHistory.findOne({ sessionId });
    res.json({ messages: chat ? chat.messages : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get history' });
  }
};

// Lấy danh sách các phiên chat theo userId (nếu có) hoặc tất cả (cho admin/test)
const listSessions = async (req, res) => {
  const { userId } = req.query;
  try {
    let query = {};
    if (userId) query.user = userId;
    // Lấy sessionId, createdAt, số lượng messages
    const sessions = await ChatHistory.find(query).sort({ createdAt: -1 }).select('sessionId createdAt messages').lean();
    const result = sessions.map(s => ({
      sessionId: s.sessionId,
      createdAt: s.createdAt,
      messageCount: s.messages.length
    }));
    res.json({ sessions: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list sessions' });
  }
};

export default {
  saveMessage,
  getHistory,
  listSessions
}; 