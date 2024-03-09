import React, { useState, useEffect, createContext } from "react";
import useLocalStorageValue from "../hooks/useLocalStorageValue";
import Modal from "./Modal.jsx";
import StartDialog from "./StartDialog.jsx";
import LobbyDialog from "./LobbyDialog.jsx";
import GameplayOverlay from "./GameplayOverlay.jsx";
import "./ContentScriptApp.css";

const DEFAULT_DATA = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}'
const DATA_LOCALSTORAGE_KEY = 'infinite-craft-data';
const INFINITE_CRAFT_URL = "https://neal.fun/infinite-craft/";
export const WebSocketContext = createContext();
export const GameStateContext = createContext();

const ContentScriptApp = () => {
    const [savedCrafts, setSavedCrafts] = useLocalStorageValue("saved_crafts");
    const [isMultiplayerMode, setIsMultiplayerMode] = useLocalStorageValue("is_multiplayer");
    const [serverURL, setServerURL] = useLocalStorageValue("server_URL", "localhost");
    
    // for security reasons, the browser won't let us use HTTP from the HTTPS website unless it is pointed to localhost
    // use regular HTTP for testing purposes but switch over to HTTPS when we have to
    // this also means if we are hosting an actual server, we need to have an SSL certificate set up
    const location = serverURL;
    const wsProtocol = location !== "localhost" && location !== "127.0.0.1" ? "wss" : "ws";
    const httpProtocol = location !== "localhost" && location !== "127.0.0.1" ? "https" : "http";
    const port = wsProtocol === "wss" ? 443 : 80;
    

    const [webSocketState, setWebSocketState] = useState();
    const [gameState, setGameState] = useState();
    
    // set up listeners for messages from other parts of the extension
    useEffect(() => {
        chrome.runtime.onMessage.addListener((data, sender) => {
            if (data.message === "reload") {
                window.location.href = INFINITE_CRAFT_URL;
            }
        });
    }, []);

    // set up connection to websocket server

    useEffect(() => {
        if (serverURL) {
            const webSocket = new WebSocket(`${wsProtocol}://${location}:${port}`)
            setWebSocketState({
                ws: webSocket,
                isConnected: webSocket.readyState === WebSocket.OPEN,
                error: null,
                sendData: (reason, details) => {
                    webSocket.send(JSON.stringify({"reason": reason, "details": details}));
                },
                "location": location,
                "wsProtocol": wsProtocol,
                "httpProtocol": httpProtocol,
                "port": port
            });
        }
    }, [serverURL])
    
    useEffect(() => {
        webSocketState?.ws?.addEventListener("open", () => {
            setWebSocketState(prevData => ({
                ...prevData,
                isConnected: true
            }));
        });
    
        webSocketState?.ws?.addEventListener("error", (err) => {
            setWebSocketState(prevData => ({
                ...prevData,
                isConnected: false,
                error: err
            }));
        });

        webSocketState?.ws?.addEventListener("close", e => {
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
    
        webSocketState?.ws?.addEventListener("message", e => {
            const data = JSON.parse(e.data);
            if (data.reason === "UPDATE_GAME_STATE") {
                console.log("Game state update ", data.details);
                setGameState(data.details);
            }
        });
    }, [webSocketState]);

    useEffect(() => {
        if (webSocketState?.error != null && isMultiplayerMode) {
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
        } else {
            if (isMultiplayerMode) {
                if (window.location.href != INFINITE_CRAFT_URL) {
                    alert("Redirecting you to Infinite Craft (return to Infinite Craft Singleplayer Mode to stop this!)");
                    window.location.href = INFINITE_CRAFT_URL;
                }
                if (localStorage[DATA_LOCALSTORAGE_KEY] != DEFAULT_DATA) {
                    setSavedCrafts(localStorage[DATA_LOCALSTORAGE_KEY]);
                    localStorage[DATA_LOCALSTORAGE_KEY] = DEFAULT_DATA;
                    window.location.reload();
                }
            } else {
                localStorage[DATA_LOCALSTORAGE_KEY] = savedCrafts;
                //setInterval(checkForChanges, 100);
            }
        }

        
    }, [isMultiplayerMode, savedCrafts]);


    // various things that need to listen to the game state
    useEffect(() => {
        // TODO gameState.error is set when the user did something wrong, like trying to join a room that doesn't exist
        // this creates an alert whenever it happens but it should probably be somewhere else
        if (gameState?.error) {
            alert(gameState?.error);
        }

        if (gameState?.winner) {
            localStorage[DATA_LOCALSTORAGE_KEY] = DEFAULT_DATA;
        }

    }, [gameState]);
    return (
        <WebSocketContext.Provider value={webSocketState}>
            <GameStateContext.Provider value={gameState}>
                <div>
                    {isMultiplayerMode && webSocketState && !webSocketState?.error && (
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