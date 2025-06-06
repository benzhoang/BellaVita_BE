const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const FinancialReport = sequelize.define('FinancialReport', {
  report_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  period: DataTypes.STRING(50),
  revenue: DataTypes.DECIMAL(12, 2),
  expenses: DataTypes.DECIMAL(12, 2),
  profit: DataTypes.DECIMAL(12, 2),
}, {
  tableName: 'financial_reports',
  timestamps: true,
  underscored: true,
});

module.exports = FinancialReport;