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
    const match = game?.players.find(player => player.playerID === id);

    if (match) {
        return match;
    }
}

function findGameWithPlayer(games, id) {
    for (const game of games) {
        const match = game?.players.find(player => player.playerID === id);
        if (match) {
            return game;
        }
    }
}

function endGame(game) {
    console.log(`Ending game in room ${game.roomID}`);
    game.gameStatus = "ENDED";
    game.timer = 0;
    let winner = "TIE";

    if (game.players.length === 1) {
        winner = game.players[0].playerID;
        game.messages.push(`${game.players[0].name} has won the game!`)
    } else {
        if (game.players[0].words.length > game.players[1].words.length) {
            winner = game.players[0].playerID;
            game.messages.push(`${game.players[0].name} has won the game!`)

        } else if (game.players[1].words.length > game.players[0].words.length) {
            winner = game.players[1].playerID;
            game.messages.push(`${game.players[1].name} has won the game!`)
        } else {
            game.messages.push("It was a tie!")
        }
    }

    game.winner = winner;
}

module.exports = {
    createRoom,
    createPlayer,
    sendData,
    updateStateForAll,
    findPlayerWithID,
    findGameWithPlayer,
    endGame
};