const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Cart = sequelize.define('Cart', {
  cart_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.UUID,
  status: DataTypes.BOOLEAN,
}, {
  tableName: 'carts',
  timestamps: true,
  underscored: true,
});

module.exports = Cart;