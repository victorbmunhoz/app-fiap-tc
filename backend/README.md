Tech Challenge - Backend
Este é o backend do projeto Tech Challenge, uma API desenvolvida utilizando Fastify, Sequelize e SQLite, que gerencia um sistema de postagens, professores e estudantes. Agora com documentação automática via Swagger.
📌 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução
- **Fastify** - Framework backend otimizado
- **Sequelize** - ORM para banco de dados
- **SQLite** - Banco de dados leve para desenvolvimento
- **JWT (JSON Web Token)** - Autenticação e controle de acesso
- **Swagger** - Documentação interativa da API

🔧 Instalação e Configuração
1️⃣ Clone o repositório
Abra o terminal e execute:

git clone https://github.com/seu-usuario/tech-challenge-backend.git
cd tech-challenge-backend

2️⃣ Instale as dependências
Execute o seguinte comando para instalar todas as dependências do projeto:

npm install

3️⃣ Configuração do Banco de Dados
O banco de dados utilizado é o **SQLite** no ambiente de desenvolvimento. Certifique-se de que ele está instalado no sistema.
4️⃣ Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes configurações:

PORT=3000
JWT_SECRET=chave_super_secreta
DATABASE_URL=sqlite://database.sqlite

📂 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/            # Configuração do banco de dados
│   ├── controllers/       # Lógica de negócio
│   ├── middleware/        # Middlewares de autenticação e permissões
│   ├── models/            # Modelos do banco de dados
│   ├── routes/            # Rotas da API
│   ├── app.js             # Configuração principal do Fastify
│   ├── server.js          # Inicialização do servidor
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências do projeto
├── README.md              # Documentação do projeto
```

🚀 Executando a Aplicação
Para rodar o backend em ambiente de desenvolvimento, execute:

npm run dev

📜 Documentação com Swagger
O Swagger foi configurado para fornecer uma documentação interativa da API.
Para acessar a documentação, basta iniciar o servidor e acessar o seguinte link no navegador:

http://localhost:3000/docs

A partir dessa interface, é possível visualizar todos os endpoints disponíveis e realizar chamadas diretamente pela interface do Swagger.
📌 Conclusão
Agora o backend está completamente documentado, incluindo testes e Swagger. Se precisar de mais informações, verifique os arquivos do projeto ou os testes automatizados. 🚀
