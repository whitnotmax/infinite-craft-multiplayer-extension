const { createPlayer, sendData, updateStateForAll, findPlayerWithID, findGameWithPlayer } = require('../../utils/gameUtils');
const { keyFromValue } = require("../../utils/utils");

function updateWordsHandler(socket, games, data, sockets) {
    const senderID = keyFromValue(sockets, socket);
    const game = findGameWithPlayer(games, senderID);
    const player = findPlayerWithID(game, senderID);

    player.words = JSON.parse(data.details.wordsList).elements;
    
    // random thing included in the localstorage value
    delete player.words.darkMode;

    updateStateForAll(sockets, game);

}

module.exports = updateWordsHandler;