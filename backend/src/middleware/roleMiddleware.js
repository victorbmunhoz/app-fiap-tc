module.exports = (rolesPermitidos) => {
    return async function (request, reply) {
        if (!request.user) {
            return reply.code(403).send({ error: 'Acesso não autorizado' });
        }

        const { role, isAdmin } = request.user;

        // Se for admin, sempre pode acessar
        if (isAdmin) {
            console.log(`🔓 Acesso permitido para ADMIN: ${request.user.id}`);
            return;
        }

        // Verifica se a role do usuário está permitida na rota
        if (!rolesPermitidos.includes(role)) {
            return reply.code(403).send({ error: 'Acesso não autorizado' });
        }

        console.log(`🔓 Acesso permitido para: ${request.user.id}, Role: ${role}`);
    };
};
