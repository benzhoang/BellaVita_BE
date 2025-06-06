require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
  },
  logging: false, // bỏ log SQL nếu không cần
});

// Kiểm tra kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Đã kết nối PostgreSQL qua Sequelize thành công!');
  } catch (err) {
    console.error('❌ Lỗi kết nối Sequelize:', err.message);
  }
})();

module.exports = sequelize;
