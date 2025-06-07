const User = require('../models/userModel');

const UserController = {
  // Lấy tất cả user
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy user theo id
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo user mới
createUser: async (req, res) => {
  try {
    const { email, password, role, ...rest } = req.body;

    // Kiểm tra role hợp lệ
    const validRoles = ['customer', 'manager', 'admin', 'staff'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Role không hợp lệ' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }
    // Hash password (nếu có)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...rest, email, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
},

  // Cập nhật user
  updateUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      await user.update(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Xóa user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Kiểm tra user có liên quan đến các bảng khác không (ví dụ: orders, carts, reviews)
      const Order = require('../models/orderModel');
      const Cart = require('../models/cartModel');
      const Review = require('../models/reviewModel');

      const hasOrder = await Order.findOne({ where: { user_id: user.user_id } });
      const hasCart = await Cart.findOne({ where: { user_id: user.user_id } });
      const hasReview = await Review.findOne({ where: { user_id: user.user_id } });

      if (hasOrder || hasCart || hasReview) {
        return res.status(400).json({ error: 'Không thể xóa user vì còn liên kết với dữ liệu khác (hóa đơn, giỏ hàng, đánh giá, ...)' });
      }

      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = UserController;