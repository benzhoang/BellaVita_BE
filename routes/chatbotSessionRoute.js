const express = require('express');
const router = express.Router();
const ChatbotSessionController = require('../controllers/chatbotSessionController');
const { authenticateToken, authorizeRole, checkAIPackage } = require('../middlewares/authetication');

// Tạm thời chỉ cần authentication, chưa cần AI package check
router.use(authenticateToken);
// router.use(checkAIPackage); // TẠM THỜI DISABLE - sẽ enable khi có AI backend

// TODO: Cần tích hợp AI backend trước khi enable AI package check
console.log('🤖 Chatbot routes - AI package check TẠM THỜI DISABLE');

// User đã đăng nhập có thể sử dụng (tạm thời)
router.get('/', ChatbotSessionController.getAllChatbotSessions);
router.get('/:id', ChatbotSessionController.getChatbotSessionById);
router.post('/', ChatbotSessionController.createChatbotSession);
router.put('/:id', ChatbotSessionController.updateChatbotSession);
router.delete('/:id', ChatbotSessionController.deleteChatbotSession);

module.exports = router; 