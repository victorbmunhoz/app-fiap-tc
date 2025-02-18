module.exports = async function (request, reply) {
    if (!request.user) {
        return reply.code(403).send({ error: 'Acesso negado: Token inválido' });
    }

    if (!request.user.isAdmin) {
        return reply.code(403).send({ error: 'Acesso negado: Apenas administradores podem acessar' });
    }

    console.log(`🔓 Acesso permitido para ADMIN: ${request.user.id}`);
};
