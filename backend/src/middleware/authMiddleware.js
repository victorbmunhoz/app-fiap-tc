const jwt = require('jsonwebtoken');

module.exports = async function (request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1]; // Remove "Bearer"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return reply.code(401).send({ error: 'Token inválido' });
        }

        request.user = decoded; // Adiciona os dados do usuário autenticado no request

        console.log(`✅ Usuário autenticado: ${decoded.id}, Role: ${decoded.role}, Admin: ${decoded.isAdmin}`);
    } catch (error) {
        console.error('❌ Erro ao validar token:', error);
        return reply.code(401).send({ error: 'Falha na autenticação' });
    }
};
