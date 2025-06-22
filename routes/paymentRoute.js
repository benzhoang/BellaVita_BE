const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Endpoint để lấy tất cả payments
router.get('/', PaymentController.getAllPayments);

// Endpoint để tạo URL thanh toán
router.post('/create_payment_url', PaymentController.createPaymentUrl);

// Endpoint để VNPAY gọi về sau khi thanh toán
router.get('/vnpay_return', PaymentController.vnpayReturn);

// Endpoint để lấy payment theo ID (phải đặt sau các routes cụ thể)
router.get('/:id', PaymentController.getPaymentById);

module.exports = router; 