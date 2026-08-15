const sequelize = require('../config/db');
const User = require('./User');
const Item = require('./Item');
const Claim = require('./Claim');

User.hasMany(Item, { foreignKey: 'userId' });
Item.belongsTo(User, { foreignKey: 'userId' });

Item.hasMany(Claim, { foreignKey: 'foundItemId' });
Claim.belongsTo(Item, { as: 'foundItem', foreignKey: 'foundItemId' });

User.hasMany(Claim, { as: 'claimsMade', foreignKey: 'claimantId' });
Claim.belongsTo(User, { as: 'claimant', foreignKey: 'claimantId' });

Claim.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewedBy' });

module.exports = { sequelize, User, Item, Claim };
