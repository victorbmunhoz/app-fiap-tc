const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const teacherRoutes = async (fastify) => {
    const { Teacher } = fastify.models;

    // 🔹 Listar todos os professores (Apenas Admin)
    fastify.get('/', {
        preHandler: [authMiddleware, roleMiddleware(['admin'])],
        schema: {
            description: 'Lista todos os professores cadastrados (Apenas para Administradores).',
            tags: ['Professores'],
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: 'Lista de professores retornada com sucesso.',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            email: { type: 'string', format: 'email' },
                            isAdmin: { type: 'boolean' }
                        }
                    }
                },
                403: { description: 'Acesso não autorizado.' },
                500: { description: 'Erro ao buscar professores.' }
            }
        }
    }, async (request, reply) => {
        try {
            const teachers = await Teacher.findAll();
            reply.send(teachers);
        } catch (error) {
            reply.code(500).send({ error: 'Erro ao buscar professores' });
        }
    });

    // 🔹 Criar um professor (Apenas Admin)
    fastify.post('/', {
        preHandler: [authMiddleware, roleMiddleware(['admin'])],
        schema: {
            description: 'Cria um novo professor (Apenas para Administradores).',
            tags: ['Professores'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', minLength: 3 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    isAdmin: { type: 'boolean', default: false }
                }
            },
            response: {
                201: {
                    description: 'Professor criado com sucesso.',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        id: { type: 'integer' }
                    }
                },
                400: { description: 'Erro ao criar professor.' },
                403: { description: 'Acesso não autorizado.' }
            }
        }
    }, async (request, reply) => {
        try {
            const { name, email, password, isAdmin } = request.body;

            const newTeacher = await Teacher.create({ name, email, password, isAdmin });
            reply.code(201).send({ message: 'Professor criado com sucesso', id: newTeacher.id });
        } catch (error) {
            reply.code(400).send({ error: 'Erro ao criar professor' });
        }
    });

    // 🔹 Editar um professor (Apenas Admin)
    fastify.put('/:id', {
        preHandler: [authMiddleware, roleMiddleware(['admin'])],
        schema: {
            description: 'Edita um professor existente (Apenas para Administradores).',
            tags: ['Professores'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer', description: 'ID do professor' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string', minLength: 3 },
                    email: { type: 'string', format: 'email' },
                    isAdmin: { type: 'boolean' }
                }
            },
            response: {
                200: { description: 'Professor atualizado com sucesso.' },
                400: { description: 'Erro ao atualizar professor.' },
                403: { description: 'Acesso não autorizado.' },
                404: { description: 'Professor não encontrado.' }
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const { name, email, isAdmin } = request.body;

            const teacher = await Teacher.findByPk(id);
            if (!teacher) return reply.code(404).send({ error: 'Professor não encontrado' });

            await teacher.update({ name, email, isAdmin });
            reply.send({ message: 'Professor atualizado com sucesso' });
        } catch (error) {
            reply.code(400).send({ error: 'Erro ao atualizar professor' });
        }
    });

    // 🔹 Excluir um professor (Apenas Admin)
    fastify.delete('/:id', {
        preHandler: [authMiddleware, roleMiddleware(['admin'])],
        schema: {
            description: 'Exclui um professor pelo ID (Apenas para Administradores).',
            tags: ['Professores'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer', description: 'ID do professor' }
                }
            },
            response: {
                204: { description: 'Professor excluído com sucesso.' },
                400: { description: 'Erro ao excluir professor.' },
                403: { description: 'Acesso não autorizado.' },
                404: { description: 'Professor não encontrado.' }
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;

            const teacher = await Teacher.findByPk(id);
            if (!teacher) return reply.code(404).send({ error: 'Professor não encontrado' });

            await teacher.destroy();
            reply.code(204).send();
        } catch (error) {
            reply.code(400).send({ error: 'Erro ao excluir professor' });
        }
    });
};

module.exports = teacherRoutes;
