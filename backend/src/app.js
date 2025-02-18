const fastify = require('fastify');
require('dotenv').config();
const { connectDatabase, sequelize } = require('./config/database');
const { Teacher, Student, Post, initDatabase } = require('./models');

const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
const fastifyCors = require('@fastify/cors');

// 🔹 Criar Dados Iniciais
async function createInitialData() {
    try {
        console.log('📌 Criando dados iniciais...');
        await sequelize.sync({ force: false });

        const teacherExists = await Teacher.count();
        if (!teacherExists) {
            await Teacher.create({
                name: 'Admin',
                email: 'admin@school.com',
                password: 'admin123',
                isAdmin: true
            });
            console.log('✅ Professor Admin criado.');
        }

        const studentExists = await Student.count();
        if (!studentExists) {
            await Student.create({
                name: 'Estudante Teste',
                email: 'student@school.com',
                password: 'student123'
            });
            console.log('✅ Estudante criado.');
        }

        const postExists = await Post.count();
        if (!postExists) {
            const teacher = await Teacher.findOne({ where: { email: 'admin@school.com' } });
            await Post.create({
                title: 'Primeiro Post de Teste',
                content: 'Bem-vindo ao nosso blog!',
                authorId: teacher.id,
                authorName: teacher.name,
            });
            console.log('✅ Post inicial criado.');
        }
    } catch (error) {
        console.error('❌ Erro ao criar dados iniciais:', error);
    }
}

// 🔹 Criar uma Nova Instância do Fastify
async function startServer() {
    const app = fastify({ logger: true });

    // 🛠️ Adicionando CORS para permitir requisições externas
    await app.register(fastifyCors, {
        origin: '*', // ⚠️ Permitir acesso de qualquer origem
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });

    app.register(swagger, {
        swagger: {
            info: {
                title: 'API Blog Tech Challenge',
                description: 'Gerenciamento de posts para professores e estudantes.',
                version: '1.0.0'
            },
            host: 'localhost:3000',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            securityDefinitions: {
                bearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'Adicione "Bearer <token>" para autenticação.'
                }
            }
        }
    });

    app.register(swaggerUI, { routePrefix: '/docs', exposeRoute: true });

    await connectDatabase();
    await initDatabase();
    await createInitialData();

    app.decorate('models', { Teacher, Student, Post });

    app.register(require('./routes/authRoutes'), { prefix: '/auth' });
    app.register(require('./routes/teacherRoutes'), { prefix: '/teachers' });
    app.register(require('./routes/studentRoutes'), { prefix: '/students' });
    app.register(require('./routes/postRoutes'), { prefix: '/posts' });

    const PORT = process.env.PORT || 3000;
    app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`🚀 Servidor rodando em ${address}`);
    });
}

startServer();
