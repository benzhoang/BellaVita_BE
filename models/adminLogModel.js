const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const AdminLog = sequelize.define('AdminLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  admin_id: DataTypes.INTEGER,
  action_type: DataTypes.STRING(100),
  details: DataTypes.TEXT,
}, {
  tableName: 'admin_logs',
  timestamps: true,
  underscored: true,
});

module.exports = AdminLog;