const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10, 2),
}, {
  tableName: 'order_items',
  timestamps: false,
  underscored: true,
});

module.exports = OrderItem;