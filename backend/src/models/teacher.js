const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }, // Senha sem encriptação
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

module.exports = Teacher;
