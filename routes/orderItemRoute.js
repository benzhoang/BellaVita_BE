const express = require('express');
const router = express.Router();
const OrderItemController = require('../controllers/orderItemController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, OrderItemController.getAllOrderItems);
router.get('/:id', authenticateToken, OrderItemController.getOrderItemById);
router.post('/', authenticateToken, OrderItemController.createOrderItem);
router.put('/:id', authenticateToken, OrderItemController.updateOrderItem);
router.delete('/:id', authenticateToken, OrderItemController.deleteOrderItem);

module.exports = router;