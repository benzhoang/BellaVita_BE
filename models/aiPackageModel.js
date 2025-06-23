// AI Package Model - TẠM THỜI DISABLE
// TODO: Enable khi cần tích hợp AI backend

/*
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const AIPackage = sequelize.define('AIPackage', {
  package_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  duration_days: {
    type: DataTypes.INTEGER,
    allowNull: true, // null = vĩnh viễn
  },
  max_usage: {
    type: DataTypes.INTEGER,
    allowNull: true, // null = không giới hạn
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true, // Lưu các tính năng của gói
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // true = active, false = inactive
  },
}, {
  tableName: 'ai_packages',
  timestamps: true,
  underscored: true,
});

module.exports = AIPackage;
*/

// Tạm thời export null để tránh lỗi
module.exports = null; 