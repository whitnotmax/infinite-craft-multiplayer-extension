import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext, GameStateContext } from "./ContentScriptApp.jsx";
import "./GameplayOverlay.css";

const DATA_LOCALSTORAGE_KEY = 'infinite-craft-data';

const GameplayOverlay = () => {

    let oldData = null;
    const webSocket = useContext(WebSocketContext);
    const gameState = useContext(GameStateContext);

    const [otherPlayerWords, setOtherPlayerWords] = useState([]);

    const checkForChanges = () => {
        if (localStorage[DATA_LOCALSTORAGE_KEY] != oldData) {
            oldData = localStorage[DATA_LOCALSTORAGE_KEY];
            webSocket.sendData("UPDATE_WORDS", {
                wordsList: localStorage[DATA_LOCALSTORAGE_KEY]
            });
        }
    }


    useEffect(() => {
        setInterval(checkForChanges, 100);
    }, []);

    useEffect(() => {
        for (const player of gameState?.players) {
            if (player.playerID != gameState?.you && player?.words) {
                console.warn("SETTING WORDS TO ", player.words)
                setOtherPlayerWords(player.words);
            }
        }
    }, [gameState]);

    return (
        <>
            <div id="gameplay-timer">{gameState?.timer}</div>
            <div id="gameplay-opponent-word-list-area">
                <h2 id="gameplay-opponent-label">Your opponent:</h2>
                    <div id="gameplay-opponent-word-list">
                        {Array.from(otherPlayerWords).reverse().map(word => (
                            <div className="gameplay-opponent-word-list-item">
                                <span>
                                {word.emoji}           {word.text}
                                </span>
                            </div>
                        ))}
                    </div>
            </div>
        </>
    )
}

export default GameplayOverlay;