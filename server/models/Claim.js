const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Claim = sequelize.define('Claim', {
  verificationAnswer: { type: DataTypes.TEXT, allowNull: false, validate: { len: [1, 1000] } },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
});

module.exports = Claim;
