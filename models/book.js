// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
}, {
  timestamps: true,
  tableName: 'users'
});


module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    autor: { type: DataTypes.STRING, allowNull: false },
    ano_publicacion: DataTypes.INTEGER,
    en_stock: { type: DataTypes.BOOLEAN, defaultValue: true },
    userId: { type: DataTypes.INTEGER, allowNull: false } // 👈 relación con User
  });
  return Book;
};
