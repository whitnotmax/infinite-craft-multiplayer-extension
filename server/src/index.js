const express = require('express');
const ws = require('ws');
const {v4} = require('uuid');
const cors = require('cors') 

const app = express();
app.use(express.json());
const corsOptions = {
    origin: '*'
  };
  app.use(cors(corsOptions));
const wsServer = new ws.Server({ noServer: true });

function createGame(id) {
    return {
        "id": id,
        players: []
    }
}

function createPlayer(name, socket) {
    const id = v4();
    sockets[id] = socket;
    return {
        "id": id,
        "name": name,
        words: []
    }
}

function sendData(socket, reason, details, target) {
    if (target) {
        details = {
            ...details,
            you: target
        }
    }
    
    let response = {
        "reason": reason,
        "details": details
    }


    socket.send(JSON.stringify(response));
}
const games = [];

const sockets = {};

app.post("/new-game", (req, res) => {
    let unique = false;
    let id;

    while (!unique) {
        id = Math.round(Math.random() * 10 * 1000);
        unique = true;
        for (let game in games) {
            if (game.id === id) {
                unique = false;
                break;
            }
        }
    }
    games.push(createGame(id));
    res.status(200).json(id);
});



wsServer.on('connection', socket => {
    console.log("ws connected");
    socket.on("message", data => {
        data = JSON.parse(data);
        if (data.reason === "JOIN_GAME") {
            const matches = games.filter(game => game.id === data.details.id);
            if (matches.length === 0) {
                sendData(socket, "UPDATE_GAME_STATE", {
                    "error": "Room does not exist"
                });
            } else {
                const game = matches[0];

                if (game.players.length == 2) {
                    sendData(socket, "UPDATE_GAME_STATE", {
                        "error": "Room is full"
                    });
                }
                const newPlayer = createPlayer(`Player${game.players.length + 1}`, socket);
                game.players.push(newPlayer);
                sendData(socket, "UPDATE_GAME_STATE", {
                    game
                }, newPlayer.id);

            }
        }
    });

    socket.on('close', () => {
        games.forEach(game => {
            const match = game.players.filter(player => sockets[player.id] === socket);
            if (match.length > 0) {
                const player = match[0];
                console.log(`${player.name} on game ${game.id} has left`);
                game.players.splice(game.players.indexOf(player), 1);
                delete sockets[player.id];
                console.log(game);
            }
        })
    });


});


const server = app.listen(8080, () => {
    console.log("Ready");
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
});