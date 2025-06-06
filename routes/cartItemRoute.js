const express = require('express');
const router = express.Router();
const CartItemController = require('../controllers/cartItemController');

router.get('/', CartItemController.getAllCartItems);
router.get('/:id', CartItemController.getCartItemById);
router.post('/', CartItemController.createCartItem);
router.put('/:id', CartItemController.updateCartItem);
router.delete('/:id', CartItemController.deleteCartItem);

module.exports = router;