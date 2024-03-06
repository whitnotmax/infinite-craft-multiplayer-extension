const { createPlayer, sendData, updateStateForAll, findPlayerWithID, findGameWithPlayer } = require('../../utils/gameUtils');
const { keyFromValue } = require("../../utils/utils");

function gameLoop(sockets, game) {
    if (game.timer > 0) {
        setTimeout((() => gameLoop(sockets, game)), 1000);
        game.timer--;
    } else {
        game.gameStatus = "ENDED";
    }
    updateStateForAll(sockets, game);

}

function startGameHandler(socket, games, data, sockets) {
    const senderID = keyFromValue(sockets, socket);
    const game = findGameWithPlayer(games, senderID);
    const player = findPlayerWithID(game, senderID);

    if (player?.isHost) {
        game.gameStatus = "PLAYING";
        game.timer = 100000;
        gameLoop(sockets, game);
        
    }

    updateStateForAll(sockets, game);

}

module.exports = startGameHandler;