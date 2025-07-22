const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: "1.0.0",
    title: "Desafio Técnico - API Backend",
    description: "API RESTful para ingestão e consulta de dados, com autenticação via JWT, upload de arquivos e simulação de IA.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local de desenvolvimento"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      RegisterUser: {
        nome: "Caio",
        email: "caio@email.com",
        senha: "123456"
      },
      LoginUser: {
        email: "caio@email.com",
        senha: "123456"
      },
      AuthResponse: {
        token: "jwt.token.aqui"
      },
      IAQuery: {
        pergunta: "Qual a população de Aracati?",
        datasetId: 1
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  tags: [
    {
      name: "Auth",
      description: "Autenticação de usuários (registro, login, /me)"
    },
    {
      name: "Datasets",
      description: "Upload de arquivos e gerenciamento de datasets"
    },
    {
      name: "Records",
      description: "Listagem e busca de registros em datasets"
    },
    {
      name: "Consultas IA",
      description: "Registro e histórico de consultas simuladas com IA"
    }
  ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./src/app.js');
});
