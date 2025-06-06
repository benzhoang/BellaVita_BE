const Cart = require('../models/cartModel');

const CartController = {
  // Lấy tất cả cart
  getAllCarts: async (req, res) => {
    try {
      const carts = await Cart.findAll();
      res.json(carts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy cart theo id
  getCartById: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.params.id);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
      res.json(cart);
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