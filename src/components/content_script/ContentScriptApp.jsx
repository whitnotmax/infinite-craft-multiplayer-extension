import React, { useState, useEffect, createContext } from "react";
import useLocalStorageValue from "../hooks/useLocalStorageValue";
import Modal from "./Modal.jsx";
import StartDialog from "./StartDialog.jsx";
import LobbyDialog from "./LobbyDialog.jsx";
const DEFAULT_DATA = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}'
const DATA_LOCALSTORAGE_KEY = 'infinite-craft-data';


export const WebSocketContext = createContext();
export const GameStateContext = createContext();
const webSocket = new WebSocket("ws://localhost:8080");


const ContentScriptApp = () => {
    const [savedCrafts, setSavedCrafts] = useLocalStorageValue("saved_crafts");
    const [isMultiplayerMode, setIsMultiplayerMode] = useLocalStorageValue("is_multiplayer");

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

    const [gameState, setGameState] = useState({});
    
    let oldData = null;

    const checkForChanges = () => {
        if (localStorage[DATA_LOCALSTORAGE_KEY] != oldData && localStorage[DATA_LOCALSTORAGE_KEY] != DEFAULT_DATA) {
            oldData = localStorage[DATA_LOCALSTORAGE_KEY];
            console.log("list change!");
            setSavedCrafts(localStorage[DATA_LOCALSTORAGE_KEY]);
        }
    }
    
    useEffect(() => {
        console.log("Content script init");
        chrome.runtime.onMessage.addListener((data, sender) => {
            console.log(data);
            if (data.message === "reload") {
                window.location.reload();
            }
        });

        


    }, []);

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

        webSocket.addEventListener("close", () => {
            setWebSocketState(prevData => ({
                ...prevData,
                isConnected: false,
                error: "The connection was lost."
            }));
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
        if (isMultiplayerMode == undefined) {
            return;
        }

        if (isMultiplayerMode) {
            localStorage[DATA_LOCALSTORAGE_KEY] = DEFAULT_DATA;
        } else {
            localStorage[DATA_LOCALSTORAGE_KEY] = savedCrafts;
            setInterval(checkForChanges, 100);
        }
    }, [isMultiplayerMode, savedCrafts]);

    useEffect(() => {
        if (webSocketState.error != null) {
            alert(`An error occurred and Multiplayer Mode cannot continue${webSocketState.error === "" ? "." : ": " + webSocketState.error}`);
            window.location.reload();
        }
    }, [webSocketState]);
    return (
        <WebSocketContext.Provider value={webSocketState}>
            <GameStateContext.Provider value={gameState}>
                <div className="extension-content">
                    {isMultiplayerMode && !webSocketState.error && (
                        <>
                        <Modal>
                            {webSocketState.isConnected ? (
                                <StartDialog />
                            ) : (
                                <>
                                    <h1>Loading...</h1>
                                </>
                            )}
                        </Modal>                  
                        </>
                    )}
                </div>
            </GameStateContext.Provider>
        </WebSocketContext.Provider>
    )
}

export default ContentScriptApp;