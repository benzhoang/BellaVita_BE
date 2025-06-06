const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'categories',
  timestamps: false,
  underscored: true,
});

module.exports = Category;