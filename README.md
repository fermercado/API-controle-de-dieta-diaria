# 🍏 API de Controle de Dieta Diária

## 📝 Descrição

Esta API fornece uma solução eficiente para o gerenciamento de dietas diárias. Utilizando Node.js e TypeScript, ela permite aos usuários criar um perfil, fazer login, e gerenciar suas refeições, identificando quais fazem parte de sua dieta.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.

### 📦 Dependências

- **bcryptjs (2.4.3)**: Biblioteca para hashing de senhas.
- **dotenv (16.3.1)**: Carrega variáveis de ambiente de um arquivo `.env`.
- **express (4.18.2)**: Framework web para Node.js.
- **jsonwebtoken (9.0.2)**: Implementa autenticações com tokens JSON Web Tokens.
- **sqlite3 (5.1.7)**: Biblioteca que implementa banco de dados SQL.
- **swagger-jsdoc (6.2.8)**: Integra JSDoc com Swagger para documentação da API.
- **swagger-ui-express (5.0.0)**: Middleware para servir a UI do Swagger.
- **typeorm (0.3.19)**: ORM para TypeScript e JavaScript.
- **zod (3.22.4)**: Biblioteca de parsing e validação para TypeScript.

### 🛠️ DevDependencies

- **eslint (8.56.0)**: Ferramenta de análise de código.
- **jest (29.7.0)**: Framework de testes para JavaScript.
- **prettier (3.1.1)**: Formatador de código.
- **typescript (5.3.3)**: Superset de JavaScript com tipagem estática.

## 🚀 Iniciando o Projeto

### Configuração do Ambiente

1. **Clone o repositório**:
   ```bash
   git clone git@github.com:fermercado/API-controle-de-dieta-diaria.git
   cd API-controle-de-dieta-diaria
   ```

### 📌 Instalação

#### Instale as Dependências

Antes de iniciar o projeto, você deve instalar todas as dependências necessárias. No diretório raiz do projeto, execute o seguinte comando:

```bash
npm install
```

### 🔐 Configuração do Arquivo `.env`

Para configurar o ambiente de desenvolvimento, você precisará definir algumas variáveis de ambiente. Faça uma cópia do arquivo `env.example` fornecido e renomeie para `.env`. Então, preencha as variáveis com os valores apropriados.

O arquivo `.env` deve ter o seguinte formato:

```env
JWT_SECRET=suaChaveSecreta
DATABASE_URL=caminhoParaSuaBaseDeDados
```

## 🚀 Executando o Projeto

### 🛠️ Modo de Desenvolvimento

Para executar o projeto em modo de desenvolvimento, onde o servidor será reiniciado automaticamente a cada alteração de arquivo graças ao Nodemon, use o seguinte comando:

```bash
npm run dev
```

### 🧪 Executar Testes

Para executar a suíte de testes e verificar a cobertura de código, utilize o comando:

```bash
npm run test
```

### Iniciar Servidor

### ▶️ Iniciar Servidor

Depois de construir o projeto com `npm run build`, você pode iniciar o servidor com:

```bash
npm start
```

## 📃 Documentação da API com Swagger

A documentação completa da API está disponível e pode ser acessada via Swagger UI. Isso permite que você visualize e interaja com a API's endpoints diretamente através do navegador.

Para acessar a documentação Swagger e testar os endpoints:

```bash
http://localhost:3000/api-docs/
```

## 📡 Rotas da API

### 👥 Usuários

#### ➕ Criar Usuário

- **Endpoint**: `/users`
- **Método**: POST
- **Descrição**: Cria um novo usuário.
- **Body**:
  ```json
  {
    "firstName": "String",
    "lastName": "String",
    "email": "user@example.com",
    "password": "string",
    "confirmPassword": "Password123"
  }
  ```

#### 🔓 Login

- **Endpoint**: `/users/login`
- **Método**: POST
- **Descrição**: Autentica o usuário.
- **Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```

  ### 🥗 Refeições

#### ➕ Adicionar Refeição

- **Endpoint**: `/meals`
- **Método**: POST
- **Descrição**: Adiciona uma nova refeição.
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "dateTime": "2024-01-22T14:34:53.524Z",
    "isDiet": true
  }
  ```

#### 📜 Listar Refeições

- **Endpoint**: `/meals`
- **Método**: GET
- **Descrição**: Lista todas as refeições.

#### 🔄 Atualizar Refeição

- **Endpoint**: `/meals/:id`
- **Método**: PUT
- **Descrição**: Atualiza uma refeição específica.
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "dateTime": "2024-01-17T14:00:00.000Z",
    "isDiet": false
  }
  ```

#### 🔍 Detalhes da Refeição

- **Endpoint**: `/meals/:id`
- **Método**: GET
- **Descrição**: Retorna detalhes de uma refeição específica.

#### ❌ Remover Refeição

- **Endpoint**: `/meals/:id`
- **Método**: DELETE
- **Descrição**: Remove uma refeição específica.

## 💖 Agradecimentos

## Gostaríamos de expressar nossa gratidão a todos que contribuíram para este projeto, seja por meio de código, sugestões ou feedback.
