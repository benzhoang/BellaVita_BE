const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'customer', // hoặc 'admin' nếu cần
  },
  social_provider: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // true = active, false = inactive
  },
  // AI Package fields - TẠM THỜI DISABLE
  /*
  ai_package_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // null = không có gói AI
    references: {
      model: 'ai_packages',
      key: 'package_id'
    }
  },
  ai_package_expires_at: {
    type: DataTypes.DATE,
    allowNull: true, // null = không có thời hạn
  },
  ai_usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Số lần đã sử dụng AI
  },
  */
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

module.exports = User;
