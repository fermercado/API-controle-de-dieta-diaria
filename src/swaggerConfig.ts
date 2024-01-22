import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API controle de dieta diaria',
      version: '1.0.0',
      description: 'Documentação da API',
    },
  },
  apis: ['./src/docs/users-docs.yaml', './src/docs/meal-docs.yaml'],
};

export default swaggerJSDoc(options);
