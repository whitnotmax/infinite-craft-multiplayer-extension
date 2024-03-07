const express = require('express');
const ws = require('ws');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
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

const httpServer = http.createServer(app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpServer.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
});

if (process.env.PRIVATE_KEY && process.env.CERT && process.env.CA) {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY);
    const certificate = fs.readFileSync(process.env.CERT);
    const ca = fs.readFileSync(process.env.CA);

    const credentials = {
        cert: certificate,
        key: privateKey,
        "ca": ca
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
        console.log("HTTPS server running on port 443");
    });

    httpsServer.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, socket => {
          wsServer.emit('connection', socket, request);
        });
    });
} else {
    console.log("SSL certificate not set up - if you are trying to host somewhere other than localhost the browser will refuse to connect!")
}
