const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const AuthController = {
  // Đăng nhập
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
      );
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = AuthController;