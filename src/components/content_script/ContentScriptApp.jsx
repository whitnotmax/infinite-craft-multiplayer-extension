import React, { useState, useEffect, createContext } from "react";
import useLocalStorageValue from "../hooks/useLocalStorageValue";
import Modal from "./Modal.jsx";
import StartDialog from "./StartDialog.jsx";
import LobbyDialog from "./LobbyDialog.jsx";
import GameplayOverlay from "./GameplayOverlay.jsx";
import "./ContentScriptApp.css";

const DEFAULT_DATA = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}'
const DATA_LOCALSTORAGE_KEY = 'infinite-craft-data';
const WEBSOCKET_NORMAL_CLOSE = 1000;

export const WebSocketContext = createContext();
export const GameStateContext = createContext();
const webSocket = new WebSocket("ws://localhost:8080");


const ContentScriptApp = () => {
    const [savedCrafts, setSavedCrafts] = useLocalStorageValue("saved_crafts");
    const [isMultiplayerMode, setIsMultiplayerMode] = useLocalStorageValue("is_multiplayer");

    const OVERRIDE_MOUSE_PASSTHROUGH = false;

    const [webSocketState, setWebSocketState] = useState({
        ws: webSocket,
        isConnected: false,
        error: null,
        sendData: (reason, details) => {
            console.log("sending data");
            console.log({"reason": reason, "details": details});
            webSocket.send(JSON.stringify({"reason": reason, "details": details}));
        }
    });

    const [gameState, setGameState] = useState();
    
    let oldData = null;

    const checkForChanges = () => {
        if (localStorage[DATA_LOCALSTORAGE_KEY] != oldData && localStorage[DATA_LOCALSTORAGE_KEY] != DEFAULT_DATA) {
            oldData = localStorage[DATA_LOCALSTORAGE_KEY];
            console.log("list change!");
            setSavedCrafts(localStorage[DATA_LOCALSTORAGE_KEY]);
        }
    }
    
    // set up listeners for messages from other parts of the extension
    useEffect(() => {
        console.log("Content script init");
        chrome.runtime.onMessage.addListener((data, sender) => {
            console.log(data);
            if (data.message === "reload") {
                window.location.reload();
            }
        });
    }, []);

    // set up connection to websocket server
    useEffect(() => {
        setWebSocketState(prevData => ({
            ...prevData,
            isConnected: webSocketState.ws.readyState
        }));
        webSocket.addEventListener("open", () => {
            console.log("Connection ready");
            setWebSocketState(prevData => ({
                ...prevData,
                isConnected: true
            }));
        });
    
        webSocket.addEventListener("error", (err) => {
            setWebSocketState(prevData => ({
                ...prevData,
                isConnected: false,
                error: err
            }));
        });

        webSocket.addEventListener("close", e => {
            if (e.wasClean) {
                window.location.reload();
            } else {
                setWebSocketState(prevData => ({
                    ...prevData,
                    isConnected: false,
                    error: "The connection was lost."
                }));
            }
            
        });
    
        webSocket.addEventListener("message", e => {
            const data = JSON.parse(e.data);
            console.log(data);
            if (data.reason === "UPDATE_GAME_STATE") {
                console.log("Game state update");
                setGameState(data.details);
                console.log(data.details);
            }
        });
    }, []);

    useEffect(() => {
        if (webSocketState.error != null) {
            alert(`An error occurred and Multiplayer Mode cannot continue${webSocketState.error === "" ? "." : ": " + webSocketState.error}`);
            window.location.reload();
        }
    }, [webSocketState]);

    //
    // are we in single-player mode? --> sit in the background and constantly save the changes to the found words
    // are we in multiplayer mode? --> set the words to what they need to be
    // 
    useEffect(() => {
        if (isMultiplayerMode == undefined) {
            return;
        }

        if (isMultiplayerMode) {
            if (localStorage[DATA_LOCALSTORAGE_KEY] != DEFAULT_DATA) {
                localStorage[DATA_LOCALSTORAGE_KEY] = DEFAULT_DATA;
                window.location.reload();
            }
        } else {
            localStorage[DATA_LOCALSTORAGE_KEY] = savedCrafts;
            setInterval(checkForChanges, 100);
        }
    }, [isMultiplayerMode, savedCrafts]);


    // various things that need to listen to the game state
    useEffect(() => {
        // TODO gameState.error is set when the user did something wrong, like trying to join a room that doesn't exist
        // this creates an alert whenever it happens but it should probably be somewhere else
        if (gameState?.error) {
            alert(gameState?.error);
        }

    }, [gameState]);
    return (
        <WebSocketContext.Provider value={webSocketState}>
            <GameStateContext.Provider value={gameState}>
                <div>
                    {isMultiplayerMode && !webSocketState?.error && (
                        <>
                            {!webSocketState.isConnected && (
                                <Modal>
                                    <h1>Loading...</h1>
                                </Modal>
                            )}

                            {webSocketState.isConnected && (!gameState || gameState?.error) && (
                                <Modal>
                                    <StartDialog />
                                </Modal>
                            )}

                            {webSocketState.isConnected && (gameState && !gameState?.error) && (gameState?.gameStatus === "ENDED" 
                                || gameState?.gameStatus === "COUNTDOWN") && (
                                <Modal>
                                    <LobbyDialog />
                                </Modal>
                            )} 

                            {webSocketState.isConnected && (gameState && !gameState?.error) && gameState?.gameStatus === "PLAYING" && (
                                <GameplayOverlay />
                            )} 
                        </>
                    )}
                </div>
            </GameStateContext.Provider>
        </WebSocketContext.Provider>
    )
}

export default ContentScriptApp;