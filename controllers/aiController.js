const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ChatbotSession = require('../models/chatBotSessionModel');
const Product = require('../models/productModel');
const { Op } = require('sequelize');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.chatWithGemini = async (req, res) => {
  const { prompt, skin_type, routine } = req.body;
  const user_id = req.user && req.user.user_id;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    // 1. Gửi prompt khởi tạo ép trả lời tiếng Việt + prompt user lên Gemini
    const systemPrompt = "Từ bây giờ, hãy luôn trả lời mọi câu hỏi bằng tiếng Việt.";
    const fullPrompt = `${systemPrompt}\n${prompt}`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      }
    );
    const data = await response.json();
    // console.log('Gemini raw response:', JSON.stringify(data, null, 2));
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // 2. Nhận diện loại da từ câu trả lời AI
    const skinTypes = ['da dầu', 'da khô', 'da nhạy cảm', 'da hỗn hợp'];
    let detectedSkinType = skinTypes.find(type => aiText.toLowerCase().includes(type));

    // 3. Chỉ truy vấn sản phẩm phù hợp với loại da nếu đã nhận diện được
    let recommendedProducts = [];
    if (detectedSkinType) {
      recommendedProducts = await Product.findAll({
        where: {
          skin_type: { [Op.iLike]: `%${detectedSkinType}%` }
        }
      });
    }

    // 4. Lưu lịch sử chat
    const sessionData = {
      skin_type: skin_type || detectedSkinType || null,
      recommendation: aiText,
      routine: routine || '',
    };
    if (user_id) sessionData.user_id = user_id;
    await ChatbotSession.create(sessionData);

    // 5. Trả về kết quả
    res.json({
      reply: aiText,
      detectedSkinType: detectedSkinType || 'Không xác định',
      recommendedProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 