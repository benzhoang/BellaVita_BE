const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const AdCampaign = sequelize.define('AdCampaign', {
  campaign_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  platform: DataTypes.STRING(50),
  budget: DataTypes.DECIMAL(12, 2),
  reach: DataTypes.INTEGER,
  clicks: DataTypes.INTEGER,
  conversion_rate: DataTypes.FLOAT,
}, {
  tableName: 'ad_campaigns',
  timestamps: true,
  underscored: true,
});

module.exports = AdCampaign;