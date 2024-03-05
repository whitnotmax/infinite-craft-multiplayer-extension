const ws = require('ws');
const { updateStateForAll } = require('../utils/gameUtils');
const joinGameHandler = require('./message_handlers/joinGameHandler');

const sockets = {};

function connectionHandler(socket, games) {
    console.log("ws connected");
    socket.on("message", data => {
        data = JSON.parse(data);
        if (data.reason === "JOIN_GAME") {
            joinGameHandler(socket, games, data, sockets);
        }
    });
}

function closeHandler(socket, games) {
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
                updateStateForAll(sockets, game);
            }
            delete sockets[player.playerID];
            console.log(game);
        }
    })
}

module.exports = {
    connectionHandler,
    closeHandler
}

    