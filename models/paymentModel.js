const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: DataTypes.INTEGER,
  method: DataTypes.STRING(50),
  status: DataTypes.BOOLEAN,
  transaction_id: DataTypes.STRING(255),
  processed_at: DataTypes.DATE,
}, {
  tableName: 'payments',
  timestamps: false,
  underscored: true,
});

module.exports = Payment;