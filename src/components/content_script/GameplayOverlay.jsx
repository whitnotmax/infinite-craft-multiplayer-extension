import React, { useContext, useEffect } from "react";
import { WebSocketContext, GameStateContext } from "./ContentScriptApp.jsx";
import "./GameplayOverlay.css";

const DATA_LOCALSTORAGE_KEY = 'infinite-craft-data';
const DEFAULT_DATA = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}'

const GameplayOverlay = () => {
    let oldData = null;
    const webSocket = useContext(WebSocketContext);
    const gameState = useContext(GameStateContext);

    const checkForChanges = () => {
        if (localStorage[DATA_LOCALSTORAGE_KEY] != oldData) {
            oldData = localStorage[DATA_LOCALSTORAGE_KEY];
            console.log("list change!");
            webSocket.sendData("UPDATE_WORDS", {
                wordsList: localStorage[DATA_LOCALSTORAGE_KEY]
            });
        }
    }

    useEffect(() => {
        //setInterval(checkForChanges, 100);
    }, []);

    return (
        <>
            <div id="gameplay-timer">60</div>
        </>
    )
}

export default GameplayOverlay;