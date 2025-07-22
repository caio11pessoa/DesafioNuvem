// server.js

require('dotenv').config(); // Carrega variáveis de ambiente
const app = require('./app'); // Importa o app configurado
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
