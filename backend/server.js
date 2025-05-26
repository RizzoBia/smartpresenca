require('dotenv').config();
const express = require('express');
const app = express();
const routers = require('./src/routers/routers');
const cors = require('cors');

// Middleware para CORS → ANTES de tudo!
app.use(cors({
    origin: 'http://127.0.0.1:5501',  // ou '*' para liberar tudo, mas cuidado.
    credentials: true
}));

// Middleware para JSON
app.use(express.json());

// Usando as rotas
app.use('/', routers);

// Iniciando o servidor
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
    console.log(`API INICIALIZADA na porta ${PORT}`);
});
