const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BellaVita API',
      version: '1.0.0',
      description: 'API documentation for BellaVita project',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
  },
  apis: ['./routes/*.js'], // Quét các file route để lấy swagger comment
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;