//Imports
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
//Reativar depois dos testes
//const { limiteGeral } = require('./middlewares/rateLimit.js');

//Routes
const staticRoutes = require('./routes/static.js')
const loginRoutes = require('./routes/logins.js');
const perfilRoutes = require('./routes/perfil.js');
const usuarioRoutes = require('./routes/candidatos.js');
const tagRoutes = require('./routes/tags.js');
const experienciaRoutes = require('./routes/experiencias.js');
const empresaRoutes = require('./routes/empresas.js');
const tiposRoutes = require('./routes/tipos.js');
const chatRoutes = require('./routes/chats.js');

//Sockets
const setupChat = require('./sockets/chatSocket.js');

//Dotenv
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const server = require('http').createServer(app);
const io = require('socket.io')(server);

setupChat(io)

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//Reativar depois dos testes
//app.use(limiteGeral);


//tasks
require('./tasks/cronLimpezaMensagens.js')
require('./tasks/cronLimpezaTokens.js')

//Rotas
app.use(staticRoutes)
app.use(loginRoutes);
app.use(perfilRoutes);
app.use(usuarioRoutes);
app.use(tagRoutes);
app.use(experienciaRoutes);
app.use(empresaRoutes);
app.use(tiposRoutes);
app.use(chatRoutes);

//Porta do servidor
server.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
