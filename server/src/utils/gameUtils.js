const {v4} = require('uuid');

function createRoom(id) {
    return {
        "roomID": id,
        players: [],
        messages: [],
        gameStatus: "ENDED",
        winner: null,
        timer: 0,
        _internalState: {
            totalConnected: 0
        }
    }
}

function createPlayer(name, isHost) {
    const id = v4();
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

    if (response.details._internalState != undefined) {
        delete response.details._internalState;
    }

    socket.send(JSON.stringify(response));
}

function updateStateForAll(sockets, game) {
    game.players.forEach(player => {
        sendData(sockets[player.playerID], "UPDATE_GAME_STATE", {
            ...game
        }, player.playerID);
    });
}

function findPlayerWithID(game, id) {
    const match = game?.players.filter(player => player.playerID === id);

    if (match) {
        return match[0];
    }
}

function findGameWithPlayer(games, id) {
    for (const game of games) {
        const match = game?.players.filter(player => player.playerID === id);
        if (match) {
            return game;
        }
    }
}

module.exports = {
    createRoom,
    createPlayer,
    sendData,
    updateStateForAll,
    findPlayerWithID,
    findGameWithPlayer
};