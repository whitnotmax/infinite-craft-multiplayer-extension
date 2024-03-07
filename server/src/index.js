const express = require('express');
const ws = require('ws');
const cors = require('cors') 
const {connectionHandler, closeHandler } = require('./sockets/socketHandlers');
const newGameController = require('./controllers/newGameController');
const games = []; 

const app = express();
app.use(express.json());
const corsOptions = {
    origin: '*'
  };
  app.use(cors(corsOptions));
const wsServer = new ws.Server({ noServer: true });

const sockets = {};

app.use('/new-game', newGameController({
    "games": games
}));



wsServer.on('connection', socket => {
    connectionHandler(socket, games);

    socket.on('close', () => {
        closeHandler(socket, games);
    });
});

    
const server = app.listen(80, () => {
    console.log("Ready");
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
});