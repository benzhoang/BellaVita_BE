const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const CartItemController = require('../controllers/cartItemController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, CartController.getAllCarts);
router.get('/:id', authenticateToken, CartController.getCartById);
router.post('/', authenticateToken, CartController.createCart);
router.put('/:id', authenticateToken, CartController.updateCart);
router.delete('/:id', authenticateToken, CartController.deleteCart);

router.get('/:id/cart-items', authenticateToken, CartItemController.getByCartId);
router.post('/:id/cart-items', authenticateToken, CartItemController.create);
router.put('/:id/cart-items/:id', authenticateToken, CartItemController.update);
router.delete('/:id/cart-items/:id', authenticateToken, CartItemController.delete);

module.exports = router;