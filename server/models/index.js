const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const Message = require('./Message');
const GlobalConfig = require('./GlobalConfig');

// Relationships
User.hasMany(User, { as: 'Subordinates', foreignKey: 'teamLeaderId' });
User.belongsTo(User, { as: 'TeamLeader', foreignKey: 'teamLeaderId' });

User.hasMany(Task, { as: 'AssignedTasks', foreignKey: 'userId' });
Task.belongsTo(User, { as: 'Owner', foreignKey: 'userId' });

User.hasMany(Task, { as: 'CreatedTasks', foreignKey: 'creatorId' });
Task.belongsTo(User, { as: 'Creator', foreignKey: 'creatorId' });

User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });

User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

module.exports = {
  sequelize,
  User,
  Task,
  Message,
  GlobalConfig
};
