'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Auth = loader.database.define('auth', {
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
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
  }
},
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Auth;