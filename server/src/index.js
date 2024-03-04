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

function createRoom(id) {
    return {
        "roomID": id,
        players: [],
        messages: [],
        _internalState: {
            totalConnected: 0
        }
    }
}

function createPlayer(name, isHost, socket) {
    const id = v4();
    sockets[id] = socket;
    return {
        "playerID": id,
        "name": name,
        "words": [],
        "isHost": isHost
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

    console.log("UHG");
    console.log(response.details);
    if (response.details._internalState != undefined) {
        console.log('removing internal state');
        delete response.details._internalState;
    }

    socket.send(JSON.stringify(response));
}

function updateStateForAll(game) {
    game.players.forEach(player => {
        sendData(sockets[player.playerID], "UPDATE_GAME_STATE", {
            ...game
        }, player.playerID);
    });
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
            if (game.roomID === id) {
                unique = false;
                break;
            }
        }
    }
    games.push(createRoom(id));
    res.status(200).json(id);
});



wsServer.on('connection', socket => {
    console.log("ws connected");
    socket.on("message", data => {
        data = JSON.parse(data);
        if (data.reason === "JOIN_GAME") {
            const matches = games.filter(game => game.roomID === data.details.id);
            if (matches.length === 0) {
                sendData(socket, "UPDATE_GAME_STATE", {
                    "error": "Room does not exist"
                });
                return;

            } else {
                const game = matches[0];

                if (game.players.length == 2) {
                    sendData(socket, "UPDATE_GAME_STATE", {
                        "error": "Room is full"
                    });
                    return;
                }

                if (Object.values(sockets).includes(socket)) {
                    sendData(socket, "UPDATE_GAME_STATE", {
                        "error": "You cannot be in more than one game at the same time."
                    });
                    return;
                }
                
                const newPlayer = createPlayer(`Player${game.players.length + 1}`, game.players.length === 0, socket);
                game.players.push(newPlayer);
                game._internalState.totalConnected++;
                sendData(socket, "UPDATE_GAME_STATE", {
                    ...game
                }, newPlayer.playerID);
                game.messages.push(`${newPlayer.name} has joined the room.`)
                updateStateForAll(game);

            }
        }
    });

    socket.on('close', () => {
        games.forEach(game => {
            const match = game.players.filter(player => sockets[player.playerID] === socket);
            if (match.length > 0) {
                const player = match[0];
                console.log(`${player.name} on game ${game.roomID} has left`);
                game.players.splice(game.players.indexOf(player), 1);
                game.messages.push(`${player.name} has left the room.`)
                
                if (game.players.length === 0) {
                    delete games[games.indexOf(game)];
                } else {
                    if (player.isHost) {
                        game.players[0].isHost = true;
                        game.messages.push(`${game.players[0].name} is now the host.`);
                    }
                    updateStateForAll(game);
                }
                delete sockets[player.playerID];
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