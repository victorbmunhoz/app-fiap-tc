📱 Frontend Mobile - Tech Challenge FIAP
Este é o frontend mobile do projeto Tech Challenge FIAP, desenvolvido utilizando React Native com Expo. O aplicativo permite que estudantes, professores e administradores gerenciem e visualizem posts, com autenticação segura via JWT.

🚀 Tecnologias Utilizadas
React Native com Expo
React Navigation para navegação
AsyncStorage e SecureStore para persistência de dados
Axios para integração com o backend
Styled Components para estilização

📂 Estrutura do Projeto
frontend-mobile/
│── src/
│   ├── contexts/      # Contexto de autenticação
│   ├── screens/       # Telas do aplicativo
│   ├── services/      # Comunicação com a API
│   ├── navigation/    # Configuração da navegação
│── assets/            # Ícones, imagens e recursos visuais
│── App.js             # Componente principal
│── package.json       # Dependências e configurações do projeto
│── README.md          # Documentação do projeto


⚙️ Instalação e Configuração
📌 Pré-requisitos:
Node.js instalado (versão recomendada: LTS)

Expo CLI instalado globalmente:
npm install -g expo-cli

Backend rodando localmente ou em servidor remoto

📥 Clonar o repositório
git clone https://github.com/victorbmunhoz/app-fiap-tc.git
cd frontend-mobile

📦 Instalar dependências
npm install

🔧 Configurar o ambiente
Criar um arquivo .env na raiz do projeto com:
API_BASE_URL=http://SEU_BACKEND_IP:3000
⚠️ No emulador Android, use http://10.0.2.2:3000 em vez de localhost

▶️ Executando o projeto
npx expo start

No terminal, selecione:
w para Web
a para Android (emulador/dispositivo)
i para iOS (apenas Mac)

🔑 Autenticação
O sistema suporta três tipos de usuários:
Tipo / Permissões
Estudante /	Apenas visualizar posts
Professor /	Criar e gerenciar seus próprios posts
Administrador /	Gerenciar posts e usuários
O login é realizado via JWT, armazenado de forma segura no dispositivo.

📌 Funcionalidades Principais
✅ Login e Logout seguro
✅ Visualização de Posts
✅ Gerenciamento de Posts (para professores)
✅ Gerenciamento de Usuários (para administradores)
✅ Navegação por Bottom Tabs
✅ Estilização responsiva
