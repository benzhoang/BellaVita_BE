const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const OrderItemController = require('../controllers/orderItemController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, OrderController.getAllOrders);
router.get('/:id', authenticateToken, OrderController.getOrderById);
router.get('/user/:user_id', authenticateToken, OrderController.getOrderByUserId);
router.post('/', authenticateToken, OrderController.createOrder);
router.put('/:id', authenticateToken, OrderController.updateOrder);
router.delete('/:id', authenticateToken, OrderController.deleteOrder);

router.get('/:id/order-items', authenticateToken, OrderItemController.getByOrderId);
router.post('/:id/order-items', authenticateToken, OrderItemController.create);
router.put('/:id/order-items/:id', authenticateToken, OrderItemController.update);
router.delete('/:id/order-items/:id', authenticateToken, OrderItemController.delete);

module.exports = router;