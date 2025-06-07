const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');

const CartController = {
  // Lấy tất cả cart kèm cart item
  getAllCarts: async (req, res) => {
    try {
      const carts = await Cart.findAll();
      const cartsWithItems = await Promise.all(
        carts.map(async (cart) => {
          const cartItems = await CartItem.findAll({ where: { cart_id: cart.cart_id } });
          return { ...cart.toJSON(), cartItems };
        })
      );
      res.json(cartsWithItems);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy cart theo id kèm cart item
  getCartById: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
      const cartItems = await CartItem.findAll({ where: { cart_id: cart.cart_id } });
      res.json({ ...cart.toJSON(), cartItems });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo cart mới
  createCart: async (req, res) => {
    try {
      const cart = await Cart.create(req.body);
      res.status(201).json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Cập nhật cart
  updateCart: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
      await cart.update(req.body);
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Xóa cart
  deleteCart: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
      await cart.destroy();
      res.json({ message: 'Cart deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = CartController;