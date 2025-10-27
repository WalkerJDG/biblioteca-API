const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize, DataTypes);
const Book = require('./book')(sequelize, DataTypes);

// 🔗 Asociaciones
User.hasMany(Book, { foreignKey: 'userId' });
Book.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Book };
