const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    authorName: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Post;
