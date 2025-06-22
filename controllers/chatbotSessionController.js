const ChatbotSession = require('../models/chatBotSessionModel');

const ChatbotSessionController = {
  // Get all chatbot sessions
  getAllChatbotSessions: async (req, res) => {
    try {
      const sessions = await ChatbotSession.findAll();
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get chatbot session by ID
  getChatbotSessionById: async (req, res) => {
    try {
      const session = await ChatbotSession.findByPk(req.params.id);
      if (!session) return res.status(404).json({ error: 'Chatbot session not found' });
      res.json(session);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create a new chatbot session
  createChatbotSession: async (req, res) => {
    try {
      const session = await ChatbotSession.create(req.body);
      res.status(201).json(session);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update a chatbot session
  updateChatbotSession: async (req, res) => {
    try {
      const session = await ChatbotSession.findByPk(req.params.id);
      if (!session) return res.status(404).json({ error: 'Chatbot session not found' });
      await session.update(req.body);
      res.json(session);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete a chatbot session
  deleteChatbotSession: async (req, res) => {
    try {
      const session = await ChatbotSession.findByPk(req.params.id);
      if (!session) return res.status(404).json({ error: 'Chatbot session not found' });
      await session.destroy();
      res.json({ message: 'Chatbot session deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ChatbotSessionController; 