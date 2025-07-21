const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Product = require('../models/productModel');

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
      const { id } = req.params;
      const user_id = req.user.user_id; // Lấy user_id từ JWT token

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Kiểm tra xem đơn hàng có thuộc về user này không
      if (order.user_id != user_id) {
        return res.status(403).json({ error: 'Access denied. You can only view your own orders.' });
      }

      // Lấy các order item theo order_id
      const orderItems = await OrderItem.findAll({ where: { order_id: order.order_id } });

      res.json({ ...order.toJSON(), orderItems });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy đơn hàng theo user_id
  getOrderByUserId: async (req, res) => {
    try {
      const orders = await Order.findAll({ where: { user_id: req.params.user_id } });
      if (!orders) return res.status(404).json({ error: 'No orders found for this user' });

      // Lấy các order item theo order_id
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

  // Tạo đơn hàng mới
  createOrder: async (req, res) => {
    try {
      console.log('=== TẠO ĐƠN HÀNG MỚI ===');
      console.log('Request body:', JSON.stringify(req.body, null, 2));

      const { user_id, status, payment_method, total_amount, orderItems } = req.body;

      // Validate required fields
      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Tạo order cơ bản
      const orderData = {
        user_id,
        status: status || false,
        payment_method: payment_method || 'VNPAY',
        total_amount: total_amount || 0
      };

      console.log('📋 Dữ liệu order:', orderData);

      // Tạo order trong database
      const order = await Order.create(orderData);
      console.log('✅ Đã tạo order với ID:', order.order_id);

      let calculatedTotal = 0;
      const createdOrderItems = [];

      // Nếu có order items, tạo chúng
      if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
        console.log('📦 Bắt đầu tạo order items...');

        for (const item of orderItems) {
          const { product_id, quantity, price } = item;

          // Validate order item data
          if (!product_id || !quantity) {
            return res.status(400).json({ 
              error: 'Product ID and quantity are required for each order item' 
            });
          }

          // Kiểm tra sản phẩm có tồn tại không
          const product = await Product.findByPk(product_id);
          if (!product) {
            return res.status(400).json({ 
              error: `Product with ID ${product_id} not found` 
            });
          }

          // Sử dụng giá từ product nếu không có price trong request
          const itemPrice = price || product.price;
          const itemTotal = itemPrice * quantity;
          calculatedTotal += itemTotal;

          console.log(`  - Sản phẩm ${product_id}: ${quantity}x ${itemPrice} = ${itemTotal}`);

          // Tạo order item
          const orderItem = await OrderItem.create({
            order_id: order.order_id,
            product_id,
            quantity,
            price: itemPrice
          });

          createdOrderItems.push(orderItem);
        }

        console.log('✅ Đã tạo', createdOrderItems.length, 'order items');
        console.log('💰 Tổng tiền tính toán:', calculatedTotal);

        // Cập nhật total_amount nếu không được cung cấp hoặc khác với tính toán
        if (!total_amount || total_amount !== calculatedTotal) {
          await order.update({ total_amount: calculatedTotal });
          console.log('✅ Đã cập nhật total_amount:', calculatedTotal);
        }
      }

      // Lấy order items đã tạo để trả về
      const finalOrderItems = await OrderItem.findAll({ 
        where: { order_id: order.order_id } 
      });

      const response = {
        ...order.toJSON(),
        orderItems: finalOrderItems
      };

      console.log('🎉 HOÀN THÀNH TẠO ĐƠN HÀNG!');
      console.log('📊 Tóm tắt:');
      console.log('  - Order ID:', order.order_id);
      console.log('  - User ID:', order.user_id);
      console.log('  - Total Amount:', order.total_amount);
      console.log('  - Order Items:', finalOrderItems.length);
      console.log('=== KẾT THÚC TẠO ĐƠN HÀNG ===\n');

      res.status(201).json(response);

    } catch (err) {
      console.error('❌ Lỗi tạo order:', err);
      res.status(400).json({ error: err.message });
    }
  },

  // Cập nhật đơn hàng
  updateOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      // Chỉ cho phép cập nhật status và payment_method
      const allowedFields = {};
      if (typeof req.body.status !== 'undefined') allowedFields.status = req.body.status;
      if (typeof req.body.payment_method !== 'undefined') allowedFields.payment_method = req.body.payment_method;
      await order.update(allowedFields);
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