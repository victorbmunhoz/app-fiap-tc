const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Teacher = require('./teacher');
const Student = require('./student');
const Post = require('./post');

// 🔹 Definição de relacionamentos
Teacher.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(Teacher, { foreignKey: 'authorId', as: 'author' });

// 🔹 Inicialização do banco de dados
const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Mantém os dados existentes
        console.log('✅ Banco de dados sincronizado.');
    } catch (error) {
        console.error('❌ Erro ao sincronizar banco de dados:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, Teacher, Student, Post, initDatabase };
