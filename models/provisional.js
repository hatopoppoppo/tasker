'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Provisional = loader.database.define('provisional', {
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  mail: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
},
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Provisional;