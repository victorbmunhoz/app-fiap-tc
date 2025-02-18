Frontend Mobile - Tech Challenge FIAP

Descrição do Projeto

Este é o frontend mobile do projeto Tech Challenge FIAP, desenvolvido utilizando React Native com Expo. O aplicativo permite que estudantes, professores e administradores gerenciem e visualizem posts, garantindo autenticação segura via JWT e armazenamento seguro do token.

📌 Tecnologias Utilizadas

React Native com Expo

React Navigation para navegação

SecureStore para armazenamento seguro de credenciais

Axios para integração com o backend

Context API para gerenciamento de autenticação

🔧 Instalação e Configuração

Requisitos:

Node.js instalado (versão recomendada: LTS)

Expo CLI instalado globalmente:

npm install -g expo-cli

Backend rodando localmente ou em servidor remoto

1️⃣ Clonar o repositório

git clone https://github.com/victorbmunhoz/app-fiap-tc.git
cd frontend-mobile

2️⃣ Instalar dependências

npm install

3️⃣ Configuração do ambiente

Criar um arquivo .env na raiz do projeto com:

API_BASE_URL=http://SEU_BACKEND_IP:3000

No emulador Android, use http://10.0.2.2:3000 em vez de localhost

🚀 Executando o Projeto

npx expo start

No terminal, selecione:

w para Web

a para Android (emulador/dispositivo)

i para iOS (apenas Mac)

🔧 Autenticação

O sistema suporta três tipos de usuários:

Estudante: apenas visualiza posts

Professor: pode criar e gerenciar seus próprios posts

Administrador: gerencia posts e usuários

O login é realizado via JWT e armazenado de forma segura no dispositivo.

🔧 Funcionalidades Principais

Login e Logout seguro

Visualização de Posts

Gerenciamento de Posts (para professores)

Gerenciamento de Usuários (para administradores)

Navegação por Bottom Tabs
