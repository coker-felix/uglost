require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const storage = process.env.DATABASE_PATH || './data/uglost.sqlite';
fs.mkdirSync(path.dirname(path.resolve(storage)), { recursive: true });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
});

module.exports = sequelize;
