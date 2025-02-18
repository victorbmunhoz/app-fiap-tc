const { fastify } = require('./app');

// 🔹 Iniciar o servidor
const startServer = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`🚀 Servidor rodando em http://localhost:3000`);
    } catch (error) {
        fastify.log.error('❌ Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer();
