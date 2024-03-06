import React, { useContext, useEffect } from "react";
import { WebSocketContext, GameStateContext } from "./ContentScriptApp.jsx";
import "./GameplayOverlay.css";

const DATA_LOCALSTORAGE_KEY = 'infinite-craft-data';

const GameplayOverlay = () => {
    const opponentWords = [
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"},
        {"emoji": "💩", "word": "Test"}

    
    ]
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
            <div id="gameplay-opponent-word-list-area">
                <h2 id="gameplay-opponent-label">Your opponent:</h2>
                    <div id="gameplay-opponent-word-list">
                        {opponentWords.map(word => (
                            <div className="gameplay-opponent-word-list-item">
                                <span>
                                {word.emoji}           {word.word}
                                </span>
                            </div>
                        ))}
                    </div>
            </div>
        </>
    )
}

export default GameplayOverlay;