const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../controllers/aiController');
const { authenticateToken } = require('../middlewares/authetication');

router.post('/chat', authenticateToken, chatWithGemini);

module.exports = router; 