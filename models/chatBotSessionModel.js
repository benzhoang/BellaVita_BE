const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const ChatbotSession = sequelize.define('ChatbotSession', {
  session_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: DataTypes.UUID,
  skin_type: DataTypes.STRING(50),
  recommendation: DataTypes.TEXT,
  routine: DataTypes.TEXT,
}, {
  tableName: 'chatbot_sessions',
  timestamps: true,
  underscored: true,
});

module.exports = ChatbotSession;