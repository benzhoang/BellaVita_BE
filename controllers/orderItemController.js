const OrderItem = require('../models/orderItemModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const OrderItemsController = {
  // Lấy tất cả order items theo order_id (chỉ cho phép chủ sở hữu order)
  getByOrderId: async (req, res) => {
    const { order_id } = req.params;
    const userId = req.user?.id;
    try {
      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(404).json({ message: 'Order không tồn tại' });
      }
      if (order.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập order này' });
      }
      const items = await OrderItem.findAll({ where: { order_id } });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Thêm order item mới (chỉ cho phép chủ sở hữu order)
  create: async (req, res) => {
    const { order_id, product_id, quantity } = req.body;
    const userId = req.user?.id;
    try {
      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(400).json({ message: 'Order không tồn tại' });
      }
      if (order.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền thêm vào order này' });
      }
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
      }
      const newItem = await OrderItem.create({ order_id, product_id, quantity });
      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Sửa order item (chỉ cho phép chủ sở hữu order)
  update: async (req, res) => {
    const { item_id } = req.params;
    const { order_id, product_id, quantity } = req.body;
    const userId = req.user?.id;
    try {
      const item = await OrderItem.findByPk(item_id);
      if (!item) {
        return res.status(404).json({ message: 'Order item không tồn tại' });
      }
      const order = await Order.findByPk(item.order_id);
      if (!order || order.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền sửa order item này' });
      }
      if (order_id && order_id !== item.order_id) {
        const newOrder = await Order.findByPk(order_id);
        if (!newOrder) {
          return res.status(400).json({ message: 'Order không tồn tại' });
        }
        if (newOrder.user_id !== userId) {
          return res.status(403).json({ message: 'Bạn không có quyền chuyển order item sang order này' });
        }
      }
      if (product_id) {
        const product = await Product.findByPk(product_id);
        if (!product) {
          return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
        }
      }
      await OrderItem.update(
        {
          order_id: order_id || item.order_id,
          product_id: product_id || item.product_id,
          quantity
        },
        { where: { item_id } }
      );
      const updatedItem = await OrderItem.findByPk(item_id);
      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa order item (chỉ cho phép chủ sở hữu order)
  delete: async (req, res) => {
    const { item_id } = req.params;
    const userId = req.user?.id;
    try {
      const item = await OrderItem.findByPk(item_id);
      if (!item) {
        return res.status(404).json({ message: 'Order item không tồn tại' });
      }
      const order = await Order.findByPk(item.order_id);
      if (!order || order.user_id !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền xóa order item này' });
      }
      await OrderItem.destroy({ where: { item_id } });
      res.json({ message: 'Đã xóa thành công' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = OrderItemsController;