const { Sequelize } = require('sequelize');
const path = require('path');

const databasePath = path.resolve(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: databasePath,
    logging: process.env.NODE_ENV === 'development', // Ativa logs apenas no modo dev
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com SQLite estabelecida.');
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        process.exit(1);
    }
};

const closeDatabase = async () => {
    try {
        await sequelize.close();
        console.log('✅ Conexão com SQLite encerrada.');
    } catch (error) {
        console.error('❌ Erro ao fechar conexão com banco:', error);
    }
};

module.exports = { sequelize, connectDatabase, closeDatabase };
