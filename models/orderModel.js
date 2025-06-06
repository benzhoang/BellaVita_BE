const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.INTEGER,
  status: DataTypes.BOOLEAN,
  payment_method: DataTypes.STRING(50),
  total_amount: DataTypes.DECIMAL(10, 2),
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

module.exports = Order;