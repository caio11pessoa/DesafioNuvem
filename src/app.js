

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');
const app = express();
const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!', message: err.message });
});

module.exports = app;