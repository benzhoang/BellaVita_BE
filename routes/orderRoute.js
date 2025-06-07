const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, OrderController.getAllOrders);
router.get('/:id', authenticateToken, OrderController.getOrderById);
router.post('/', authenticateToken, OrderController.createOrder);
router.put('/:id', authenticateToken, OrderController.updateOrder);
router.delete('/:id', authenticateToken, OrderController.deleteOrder);

module.exports = router;