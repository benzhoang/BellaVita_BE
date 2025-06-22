const express = require('express');
const router = express.Router();
const ChatbotSessionController = require('../controllers/chatbotSessionController');
const { authenticateToken } = require('../middlewares/authetication');

// All routes require authentication
router.use(authenticateToken);

router.get('/', ChatbotSessionController.getAllChatbotSessions);
router.get('/:id', ChatbotSessionController.getChatbotSessionById);
router.post('/', ChatbotSessionController.createChatbotSession);
router.put('/:id', ChatbotSessionController.updateChatbotSession);
router.delete('/:id', ChatbotSessionController.deleteChatbotSession);

module.exports = router; 