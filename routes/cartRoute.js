const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, CartController.getAllCarts);
router.get('/:id', authenticateToken, CartController.getCartById);
router.post('/', authenticateToken, CartController.createCart);
router.put('/:id', authenticateToken, CartController.updateCart);
router.delete('/:id', authenticateToken, CartController.deleteCart);

module.exports = router;