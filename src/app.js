

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');
const app = express();
const routes = require('./routes');

app.use(express.json());
app.use('/api', routes); 

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;