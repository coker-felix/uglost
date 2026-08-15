const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
  kind: { type: DataTypes.ENUM('lost', 'found'), allowNull: false },
  category: { type: DataTypes.ENUM('Electronics', 'ID/Documents', 'Bags', 'Keys', 'Other'), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false, validate: { len: [1, 500] } },
  location: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  photoPath: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('active', 'returned', 'removed'), defaultValue: 'active' },
});

module.exports = Item;
