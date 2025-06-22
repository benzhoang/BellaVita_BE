const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const AuthController = {
  // Đăng nhập
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Sai tài khoản' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Sai mật khẩu' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
      );
      res.json({ userId: user.user_id, userName: user.name, userRole: user.role, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Đăng kí
  register: async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        role: role || 'user'
      });
      res.status(201).json({ message: 'Đăng ký thành công', user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = AuthController;