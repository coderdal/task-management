const User = require('./user.model');
const Task = require('./task.model');

User.hasMany(Task, { 
  foreignKey: 'assignedTo',
  as: 'assignedTasks',
  onDelete: 'CASCADE',
});

User.hasMany(Task, { 
  foreignKey: 'createdBy',
  as: 'createdTasks',
  onDelete: 'CASCADE',
});

Task.belongsTo(User, { 
  foreignKey: 'assignedTo',
  as: 'assignedUser',
});

Task.belongsTo(User, { 
  foreignKey: 'createdBy',
  as: 'creator',
});

module.exports = {
  User,
  Task,
}; 