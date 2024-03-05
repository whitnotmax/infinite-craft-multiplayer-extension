var express = require('express');
const { createRoom, createPlayer, sendData, updateStateForAll } = require('../utils/gameUtils');
// Create wrapper function that will adjust router based on provided configuration
var wrapper = function (config) {
    var router = express.Router();
    
    router.post('/', function(req, res) {
        var games = config.games;
        let unique = false;
        let id;

        while (!unique) {
            id = Math.round(Math.random() * 10 * 1000);
            unique = true;
            for (let game in games) {
                if (game.roomID === id) {
                    unique = false;
                    break;
                }
            }
        }
        games.push(createRoom(id));
        res.status(200).json(id);
    });

    return router;
}

module.exports = wrapper;