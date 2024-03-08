const ws = require('ws');
const { updateStateForAll, endGame } = require('../utils/gameUtils');
const joinGameHandler = require('./message_handlers/joinGameHandler');
const startGameHandler = require('./message_handlers/startGameHandler');
const updateWordsHandler = require('./message_handlers/updateWordsHandler');
const sendMessageHandler = require('./message_handlers/sendMessageHandler');
const sockets = {};

function connectionHandler(socket, games) {
    console.log("WS connected");
    socket.on("message", data => {
        data = JSON.parse(data);
        if (data.reason === "JOIN_GAME") {
            joinGameHandler(socket, games, data, sockets);
        } else if (data.reason === "START_GAME") {
            startGameHandler(socket, games, data, sockets);
        } else if (data.reason === "UPDATE_WORDS") {
            updateWordsHandler(socket, games, data, sockets);
        } else if (data.reason === "SEND_MESSAGE") {
            sendMessageHandler(socket, games, data, sockets);
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
                console.log(`Removing room ${game.roomID} because all players have left`)
                delete games[games.indexOf(game)];
            } else {
                if (game.gameStatus !== "ENDED") {
                    endGame(game);
                }
                if (player.isHost) {
                    game.players[0].isHost = true;
                    game.messages.push(`${game.players[0].name} is now the host.`);
                    console.log(`Player ${player.name} was promoted to host in game ${game.roomID}`);
                }
                updateStateForAll(sockets, game);
            }
            delete sockets[player.playerID];
        }
    })
}

module.exports = {
    connectionHandler,
    closeHandler
}

    