const {v4} = require('uuid');

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

    console.log("UHG");
    console.log(response.details);
    if (response.details._internalState != undefined) {
        console.log('removing internal state');
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

module.exports = {
    createRoom,
    createPlayer,
    sendData,
    updateStateForAll
};