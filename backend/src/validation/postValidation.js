const { z } = require('zod');

const postSchema = z.object({
    title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
    content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres")
});

module.exports = postSchema;
