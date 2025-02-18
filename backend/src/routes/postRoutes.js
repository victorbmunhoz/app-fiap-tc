const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { Post } = require('../models');

module.exports = async function (fastify) {
    // 📌 Listar todos os posts
    fastify.get('/', {
        schema: {
            description: 'Lista todos os posts disponíveis.',
            tags: ['Posts'],
        }
    }, async (request, reply) => {
        const posts = await Post.findAll();
        reply.send(posts);
    });

    // 📌 Obter detalhes de um post por ID
    fastify.get('/:id', {
        schema: {
            description: 'Obtém os detalhes de um post específico.',
            tags: ['Posts'],
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const post = await Post.findByPk(id);
        if (!post) return reply.code(404).send({ error: 'Post não encontrado' });

        reply.send(post);
    });

    // 📌 Criar um novo post (Somente Professores)
    fastify.post('/', {
        preHandler: [authMiddleware, roleMiddleware(['teacher'])],
        schema: {
            description: 'Cria um novo post (Apenas Professores).',
            tags: ['Posts'],
        }
    }, async (request, reply) => {
        const { title, content, authorId, authorName } = request.body;
        const post = await Post.create({ title, content, authorId, authorName });

        reply.code(201).send({ message: 'Post criado com sucesso', id: post.id });
    });

    // 📌 Editar um post (Somente o autor)
    fastify.put('/:id', {
        preHandler: [authMiddleware, roleMiddleware(['teacher'])],
        schema: {
            description: 'Edita um post (Somente o professor que criou pode editar).',
            tags: ['Posts'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer', description: 'ID do post' }
                }
            },
            body: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                    title: { type: 'string', minLength: 5 },
                    content: { type: 'string', minLength: 10 }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const { title, content } = request.body;
        const userId = request.user.id;

        const post = await Post.findByPk(id);
        if (!post) return reply.code(404).send({ error: 'Post não encontrado' });

        if (post.authorId !== userId) {
            return reply.code(403).send({ error: 'Ação não permitida. Apenas o autor pode editar o post.' });
        }

        await post.update({ title, content });

        reply.send({ message: 'Post atualizado com sucesso.' });
    });

    fastify.delete('/:id', {
        preHandler: [authMiddleware, roleMiddleware(['teacher'])],
        schema: {
            description: 'Exclui um post pelo ID (Apenas o autor ou um admin pode excluir).',
            tags: ['Posts'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'integer', description: 'ID do post' }
                }
            },
            response: {
                204: { description: 'Post excluído com sucesso.' },
                403: {
                    description: 'Ação não permitida.',
                    type: 'object',
                    properties: { error: { type: 'string' } }
                },
                404: {
                    description: 'Post não encontrado.',
                    type: 'object',
                    properties: { error: { type: 'string' } }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const userId = request.user.id;
            const isAdmin = request.user.isAdmin;
    
            const post = await Post.findByPk(id);
            if (!post) {
                fastify.log.warn(`⚠️ Tentativa de exclusão de post inexistente: ID ${id}`);
                return reply.code(404).send({ error: 'Post não encontrado' });
            }
    
            // Permite apenas o autor do post ou um admin excluir
            if (post.authorId !== userId && !isAdmin) {
                fastify.log.warn(`⚠️ Tentativa não autorizada de exclusão pelo usuário ${userId}`);
                return reply.code(403).send({ error: 'Ação não permitida' });
            }
    
            await post.destroy();
            fastify.log.info(`🗑️ Post deletado com sucesso: ID ${id}`);
            return reply.code(204).send();
        } catch (error) {
            fastify.log.error("❌ Erro ao excluir post:", error);
            return reply.code(500).send({ error: 'Erro ao excluir post' });
        }
    });
    
};
