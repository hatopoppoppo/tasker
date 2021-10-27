'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const TaskDate = loader.database.define('taskdate', {
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: false
  },
  dateId: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  }
},
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = TaskDate;