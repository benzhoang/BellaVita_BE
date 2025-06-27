const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.UUID,
  product_id: DataTypes.INTEGER,
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
});

module.exports = Review;