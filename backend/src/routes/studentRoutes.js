const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const studentRoutes = async (fastify) => {
    const { Student } = fastify.models;

    // 🔹 Listar todos os estudantes (Apenas Professores e Admins)
    fastify.get('/', {
        preHandler: [authMiddleware, roleMiddleware(['teacher', 'admin'])],
        schema: {
            description: 'Lista todos os estudantes cadastrados (Apenas Professores e Admins).',
            tags: ['Estudantes'],
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: 'Lista de estudantes retornada com sucesso.',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            email: { type: 'string', format: 'email' }
                        }
                    }
                },
                403: { description: 'Acesso não autorizado.' },
                500: { description: 'Erro ao buscar estudantes.' }
            }
        }
    }, async (request, reply) => {
        try {
            const students = await Student.findAll();
            reply.send(students);
        } catch (error) {
            reply.code(500).send({ error: 'Erro ao buscar estudantes' });
        }
    });

    // 🔹 Criar um estudante (Apenas Admins)
    fastify.post('/', {
        preHandler: [authMiddleware, roleMiddleware(['admin'])],
        schema: {
            description: 'Cria um novo estudante (Apenas para Administradores).',
            tags: ['Estudantes'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', minLength: 3 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                }
            },
            response: {
                201: {
                    description: 'Estudante criado com sucesso.',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        id: { type: 'integer' }
                    }
                },
                400: { description: 'Erro ao criar estudante.' },
                403: { description: 'Acesso não autorizado.' }
            }
        }
    }, async (request, reply) => {
        try {
            const { name, email, password } = request.body;

            const newStudent = await Student.create({ name, email, password });
            reply.code(201).send({ message: 'Estudante criado com sucesso', id: newStudent.id });
        } catch (error) {
            reply.code(400).send({ error: 'Erro ao criar estudante' });
        }
    });

    // 🔹 Editar um estudante (Apenas Admins)
    fastify.put('/:id', {
        preHandler: [authMiddleware, roleMiddleware(['admin'])],
        schema: {
            description: 'Edita um estudante existente (Apenas para Administradores).',
            tags: ['Estudantes'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer', description: 'ID do estudante' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string', minLength: 3 },
                    email: { type: 'string', format: 'email' }
                }
            },
            response: {
                200: { description: 'Estudante atualizado com sucesso.' },
                400: { description: 'Erro ao atualizar estudante.' },
                403: { description: 'Acesso não autorizado.' },
                404: { description: 'Estudante não encontrado.' }
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const updated = await Student.update(request.body, { where: { id } });

            if (!updated[0]) return reply.code(404).send({ error: 'Estudante não encontrado' });

            reply.send({ message: 'Estudante atualizado com sucesso' });
        } catch (error) {
            reply.code(400).send({ error: 'Erro ao atualizar estudante' });
        }
    });

    // 🔹 Excluir um estudante (Apenas Admins)
    fastify.delete('/:id', {
        preHandler: [authMiddleware, roleMiddleware(['admin'])],
        schema: {
            description: 'Exclui um estudante pelo ID (Apenas para Administradores).',
            tags: ['Estudantes'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer', description: 'ID do estudante' }
                }
            },
            response: {
                204: { description: 'Estudante excluído com sucesso.' },
                400: { description: 'Erro ao excluir estudante.' },
                403: { description: 'Acesso não autorizado.' },
                404: { description: 'Estudante não encontrado.' }
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const deleted = await Student.destroy({ where: { id } });

            if (!deleted) return reply.code(404).send({ error: 'Estudante não encontrado' });

            reply.code(204).send();
        } catch (error) {
            reply.code(400).send({ error: 'Erro ao excluir estudante' });
        }
    });
};

module.exports = studentRoutes;
