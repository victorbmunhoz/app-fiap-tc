const { z } = require('zod');

const teacherSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Formato de e-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    isAdmin: z.boolean().optional() // Apenas admins podem alterar isso
});

module.exports = teacherSchema;
