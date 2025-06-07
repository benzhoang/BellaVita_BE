const OrderItem = require('../models/orderItemModel');

const OrderItemController = {
  // Lấy tất cả order item
getAllOrderItems: async (req, res) => {
  try {
    // Lấy order_id từ query hoặc params (ví dụ: /order-items?order_id=123)
    const { order_id } = req.query;
    let orderItems;
    if (order_id) {
      orderItems = await OrderItem.findAll({ where: { order_id } });
    } else {
      orderItems = await OrderItem.findAll();
    }
    res.json(orderItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},

  // Lấy order item theo id
  getOrderItemById: async (req, res) => {
    try {
      const orderItem = await OrderItem.findByPk(req.params.id);
      if (!orderItem) return res.status(404).json({ error: 'Order item not found' });
      res.json(orderItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo order item mới
  createOrderItem: async (req, res) => {
    try {
      const orderItem = await OrderItem.create(req.body);
      res.status(201).json(orderItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Cập nhật order item
  updateOrderItem: async (req, res) => {
    try {
      const orderItem = await OrderItem.findByPk(req.params.id);
      if (!orderItem) return res.status(404).json({ error: 'Order item not found' });
      await orderItem.update(req.body);
      res.json(orderItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Xóa order item
  deleteOrderItem: async (req, res) => {
    try {
      const orderItem = await OrderItem.findByPk(req.params.id);
      if (!orderItem) return res.status(404).json({ error: 'Order item not found' });
      await orderItem.destroy();
      res.json({ message: 'Order item deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = OrderItemController;