const jwt = require('jsonwebtoken');
const { Teacher, Student } = require('../models');
const { z } = require('zod');
require('dotenv').config();

// 🔍 Esquema de validação com Zod
const loginSchema = z.object({
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
});

// 🔐 Função auxiliar para autenticar usuário
async function findUser(email) {
    let user = await Teacher.findOne({ where: { email } });
    if (user) return { user, role: 'teacher' };

    user = await Student.findOne({ where: { email } });
    if (user) return { user, role: 'student' };

    return null;
}

// 🚀 Rota de Login
module.exports = async function (fastify) {
    fastify.post('/login', {
        schema: {
            description: 'Autenticação para professores e estudantes',
            tags: ['Auth'],
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                }
            }
        }
    }, async (request, reply) => {
        const { email, password } = request.body;

        // ✅ Validar os dados recebidos
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
            const errorMsg = validation.error.issues.map(issue => issue.message).join(', ');
            return reply.status(400).send({ error: `Dados inválidos: ${errorMsg}` });
        }

        try {
            // 🔍 Buscar usuário no banco
            const result = await findUser(email);
            if (!result) {
                console.warn(`⚠️ Tentativa de login com e-mail não cadastrado: ${email}`);
                return reply.status(401).send({ error: 'Usuário não encontrado' });
            }

            const { user, role } = result;

            // 🔑 Verificar senha
            if (user.password !== password) {
                console.warn(`🔑 Tentativa de login com senha incorreta: ${email}`);
                return reply.status(401).send({ error: 'Senha incorreta' });
            }

            // ⚠️ Verificar a existência da chave secreta
            if (!process.env.JWT_SECRET) {
                console.error("🚨 ERRO: JWT_SECRET não foi definido no .env!");
                return reply.status(500).send({ error: "Erro interno no servidor: JWT_SECRET ausente" });
            }

            // 🎟️ Gerar o token JWT
            const token = jwt.sign(
                { id: user.id, role, isAdmin: user.isAdmin || false },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            console.log(`✅ Login bem-sucedido: ${email} | Role: ${role}`);
            reply.status(200).send({
                message: 'Login realizado com sucesso!',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role,
                    isAdmin: user.isAdmin || false
                }
            });

        } catch (error) {
            console.error(`❌ Erro inesperado durante o login: ${error.message}`, error);
            reply.status(500).send({ error: 'Erro interno no servidor' });
        }
    });
};
