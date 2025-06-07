const express = require('express');
const router = express.Router();
const CartItemController = require('../controllers/cartItemController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, CartItemController.getAllCartItems);
router.get('/:id', authenticateToken, CartItemController.getCartItemById);
router.post('/', authenticateToken, CartItemController.createCartItem);
router.put('/:id', authenticateToken, CartItemController.updateCartItem);
router.delete('/:id', authenticateToken, CartItemController.deleteCartItem);

module.exports = router;