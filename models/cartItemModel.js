const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const CartItem = sequelize.define('CartItem', {
  cart_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cart_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
}, {
  tableName: 'cart_items',
  timestamps: false,
  underscored: true,
});

module.exports = CartItem;