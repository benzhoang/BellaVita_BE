const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL(10, 2),
  brand: DataTypes.STRING(100),
  skin_type: DataTypes.STRING(50),
  image_url: DataTypes.TEXT,
  stock_quantity: DataTypes.INTEGER,
  category_id: DataTypes.INTEGER,
  barcode: DataTypes.STRING(255),
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

module.exports = Product;