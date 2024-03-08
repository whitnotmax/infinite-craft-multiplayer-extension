const { createPlayer, sendData, updateStateForAll, findPlayerWithID, findGameWithPlayer } = require('../../utils/gameUtils');
const { keyFromValue } = require("../../utils/utils");

function sendMessageHandler(socket, games, data, sockets) {
    const senderID = keyFromValue(sockets, socket);
    const game = findGameWithPlayer(games, senderID);
    const player = findPlayerWithID(game, senderID);

    const message = data.details.message;
    console.log(player);
    if (message.length <= 50 && message.trim().length > 0) {
        game.messages.push(`${player.name}: ${message}`);
    }

    updateStateForAll(sockets, game);

}

module.exports = sendMessageHandler;