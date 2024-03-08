const { updateStateForAll, findPlayerWithID, findGameWithPlayer, endGame } = require('../../utils/gameUtils');
const { keyFromValue } = require("../../utils/utils");

function gameLoop(sockets, game) {
    game.timer--;
    if (game.timer > 0) {
        setTimeout((() => gameLoop(sockets, game)), 1000);
    } else {
        if (game.gameStatus === "COUNTDOWN") {
            game.gameStatus = "PLAYING";
            game.timer = 10;
            console.log(`Game timer started in room ${game.roomID}`);
            setTimeout((() => gameLoop(sockets, game)), 1000);
        } else if (game.gameStatus !== "ENDED") {
            endGame(game);
        }
        
    }

    updateStateForAll(sockets, game);

}

function startGameHandler(socket, games, data, sockets) {
    const senderID = keyFromValue(sockets, socket);
    const game = findGameWithPlayer(games, senderID);
    const player = findPlayerWithID(game, senderID);

    if (player?.isHost) {
        console.log(`Countdown started in room ${game.roomID}`);
        game.gameStatus = "COUNTDOWN";
        game.timer = 3;
        // HACK lol
        game.timer++;
        gameLoop(sockets, game);
        
    }

    updateStateForAll(sockets, game);

}

module.exports = startGameHandler;