const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

// Endpoint để lấy tất cả payments - chỉ admin
router.get('/', authenticateToken, authorizeRole('admin'), PaymentController.getAllPayments);

// Endpoint để tạo URL thanh toán - user đã đăng nhập
router.post('/create_payment_url', authenticateToken, PaymentController.createPaymentUrl);

// Endpoint để VNPAY gọi về sau khi thanh toán - KHÔNG CẦN AUTH (callback từ VNPAY)
router.get('/vnpay_return', PaymentController.vnpayReturn);

// Endpoint để lấy payment theo ID - chỉ admin hoặc user sở hữu
router.get('/:id', authenticateToken, PaymentController.getPaymentById);

module.exports = router; 