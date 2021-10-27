'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Task = loader.database.define('task', {
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  dateId: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  },
  taskId: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Task;