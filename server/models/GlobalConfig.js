const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GlobalConfig = sequelize.define('GlobalConfig', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = GlobalConfig;
