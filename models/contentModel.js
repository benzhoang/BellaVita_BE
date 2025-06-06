const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Content = sequelize.define('Content', {
  content_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: DataTypes.STRING(50),
  title: DataTypes.STRING(255),
  body: DataTypes.TEXT,
  image_url: DataTypes.TEXT,
}, {
  tableName: 'contents',
  timestamps: true,
  underscored: true,
});

module.exports = Content;