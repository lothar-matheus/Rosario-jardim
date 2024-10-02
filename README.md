
# Rosário Jardim

## Introdução

Rosário Jardim é uma aplicação web focada em dispositivos móveis que serve como um mediador entre clientes e vendedores de plantas. A plataforma permite que os clientes escolham produtos e enviem seus pedidos diretamente para o WhatsApp do vendedor.

## Tecnologias Utilizadas

- JavaScript
- CSS
- HTML
- Node.js (v20.15.0)
- npm (v10.7.0)
- React
- Firebase (Banco de Dados e Autenticação)
- Vercel (Hospedagem)

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Git
- Node.js (v20.15.0 ou superior)
- npm (v10.7.0 ou superior)

## Configuração do Firebase

Antes de executar o projeto, você precisa configurar seu próprio Firebase. Siga estas etapas:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.
2. No painel do projeto, clique em "Adicionar app" e siga as instruções para adicionar um app da web.
3. Após criar o app, você receberá um objeto de configuração. Copie essas informações.
4. No diretório do projeto, crie um arquivo `.env` na raiz e adicione suas configurações do Firebase:

   ```
   REACT_APP_FIREBASE_API_KEY=sua_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=seu_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=seu_app_id
   ```
5. No Console do Firebase, vá para "Authentication" e habilite o método de autenticação por e-mail/senha.
6. Vá para "Realtime Database" e crie um banco de dados. Inicie no modo de teste para simplicidade.
7. Vá para "Storage" e configure o armazenamento para o seu projeto.

## Criando um Usuário Administrador

Para criar um usuário administrador:

1. No Console do Firebase, vá para "Authentication" > "Users".
2. Clique em "Add User" e crie um usuário com e-mail e senha.
3. Anote as credenciais, pois você as usará para fazer login na aplicação.

## Como Executar o Projeto

1. Clone o repositório:

   ```
   git clone https://github.com/seu-usuario/rosario-jardim.git
   ```
2. Navegue até o diretório do projeto:

   ```
   cd rosario-jardim
   ```
3. Instale as dependências:

   ```
   npm install
   ```
4. Inicie o servidor de desenvolvimento:

   ```
   npm start
   ```
5. Abra o navegador e acesse `http://localhost:3000`

## Funcionamento da Aplicação

[O resto do conteúdo permanece o mesmo...]

## Contribuição

Para contribuir com o projeto, por favor, crie um fork do repositório, faça suas alterações e envie um pull request para revisão.

## Suporte

Em caso de dúvidas ou problemas, abra uma issue no repositório do GitHub ou entre em contato com a equipe de desenvolvimento.

---

Desenvolvido por Matheus Lemos
