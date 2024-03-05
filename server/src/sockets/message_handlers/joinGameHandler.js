const { createPlayer, sendData, updateStateForAll } = require('../../utils/gameUtils');
const {v4} = require('uuid');

function joinGameHandler(socket, games, data, sockets) {
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
                
        const id = v4();
        const newPlayer = createPlayer(`Player${++game._internalState.totalConnected}`, game.players.length === 0);
        game.players.push(newPlayer);
        sockets[newPlayer.playerID] = socket;
        sendData(socket, "UPDATE_GAME_STATE", {
            ...game
        }, newPlayer.playerID);
        game.messages.push(`${newPlayer.name} has joined the room.`)
        updateStateForAll(sockets, game);

    }
}

module.exports = joinGameHandler;