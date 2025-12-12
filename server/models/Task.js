const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending'
  },
  dueDate: {
    type: DataTypes.DATEONLY
  },
  userId: { // The person who needs to do the task
    type: DataTypes.INTEGER,
    allowNull: false
  },
  creatorId: { // The person who assigned the task
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Task;
