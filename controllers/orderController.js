const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');

const OrderController = {
  // Lấy tất cả đơn hàng
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.findAll();
      // Lấy orderItems cho từng order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const orderItems = await OrderItem.findAll({ where: { order_id: order.order_id } });
          return { ...order.toJSON(), orderItems };
        })
      );
      res.json(ordersWithItems);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy đơn hàng theo id
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      // Lấy các order item theo order_id
      const orderItems = await OrderItem.findAll({ where: { order_id: order.order_id } });

      res.json({ ...order.toJSON(), orderItems });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (req, res) => {
    try {
      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Cập nhật đơn hàng
  updateOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      await order.update(req.body);
      res.json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      await order.destroy();
      res.json({ message: 'Order deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = OrderController;