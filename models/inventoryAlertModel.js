const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const InventoryAlert = sequelize.define('InventoryAlert', {
  alert_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: DataTypes.INTEGER,
  threshold: DataTypes.INTEGER,
  alerted: DataTypes.BOOLEAN,
}, {
  tableName: 'inventory_alerts',
  timestamps: true,
  underscored: true,
});

module.exports = InventoryAlert;