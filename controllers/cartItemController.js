const CartItem = require('../models/cartItemModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const CartItemsController = {
  // Lấy tất cả cart items theo cart_id
  getByCartId: async (req, res) => {
    const { cart_id } = req.params;
    const userId = req.user?.id;
    try {
      const cart = await Cart.findByPk(cart_id);
      if (!cart) {
        return res.status(404).json({ message: 'Cart không tồn tại' });
      }
      if (cart.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập cart này' });
      }
      const items = await CartItem.findAll({ where: { cart_id } });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Thêm cart item mới
  create: async (req, res) => {
    const { cart_id, product_id, quantity } = req.body;
    const userId = req.user?.id;
    try {
      const cart = await Cart.findByPk(cart_id);
      if (!cart) {
        return res.status(400).json({ message: 'Cart không tồn tại' });
      }
      if (cart.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền thêm vào cart này' });
      }
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
      }
      const newItem = await CartItem.create({ cart_id, product_id, quantity });
      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Sửa cart item
  update: async (req, res) => {
    const { item_id } = req.params;
    const { cart_id, product_id, quantity } = req.body;
    const userId = req.user?.id;
    try {
      const item = await CartItem.findByPk(item_id);
      if (!item) {
        return res.status(404).json({ message: 'Cart item không tồn tại' });
      }
      const cart = await Cart.findByPk(item.cart_id);
      if (!cart || cart.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền sửa cart item này' });
      }
      if (cart_id && cart_id !== item.cart_id) {
        const newCart = await Cart.findByPk(cart_id);
        if (!newCart) {
          return res.status(400).json({ message: 'Cart không tồn tại' });
        }
        if (newCart.user_id !== userId) {
          return res.status(403).json({ message: 'Bạn không có quyền chuyển cart item sang cart này' });
        }
      }
      if (product_id) {
        const product = await Product.findByPk(product_id);
        if (!product) {
          return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
        }
      }
      await CartItem.update(
        {
          cart_id: cart_id || item.cart_id,
          product_id: product_id || item.product_id,
          quantity
        },
        { where: { item_id } }
      );
      const updatedItem = await CartItem.findByPk(item_id);
      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa cart item
  delete: async (req, res) => {
    const { item_id } = req.params;
    const userId = req.user?.id;
    try {
      const cartItem = await CartItem.findByPk(item_id);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item không tồn tại' });
      }
      const cart = await Cart.findByPk(cartItem.cart_id);
      if (!cart || cart.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền xóa cart item này' });
      }
      await CartItem.destroy({ where: { item_id } });
      res.json({ message: 'Đã xóa thành công' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = CartItemsController;