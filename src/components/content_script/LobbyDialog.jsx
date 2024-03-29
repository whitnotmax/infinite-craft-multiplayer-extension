import React, { useContext, useEffect, useState, useRef } from "react";
import { GameStateContext, WebSocketContext } from "./ContentScriptApp.jsx";
import EndDialog from "./EndDialog.jsx";
import Modal from "./Modal.jsx";
import "./LobbyDialog.css";
import "../common/buttons.css";
const LobbyDialog = () => {
    const gameState = useContext(GameStateContext);
    const webSocket = useContext(WebSocketContext);

    const inputRef = useRef();

    const onLeaveButtonClick = () => {
        webSocket.ws.close();
    }

    const onStartButtonClick = () => {
        webSocket.sendData("START_GAME");
    }

    const onSendMessageButtonClick = () => {
        if (inputRef.current.value.length > 50) {
            alert("Message is too long")
        } else if (inputRef.current.value.trim().length < 1) {
            alert("Message cannot be blank");
        } else {
            webSocket.sendData("SEND_MESSAGE", {
                message: inputRef.current.value
            });
        }
        inputRef.current.value = "";
    }

    const onTextboxKeyDown = e => {
        e.stopPropagation();
    }

    const canStartGame = () => {
        const match = gameState?.players.filter(player => player.playerID === gameState?.you);

        if (!match)
            return false;

        return match[0].isHost && gameState?.gameStatus === "ENDED" && gameState?.players.length === 2; 
    }

    return (
        <>
            <span id="lobby-dialog-top">
                <div id="players-list-container">
                    <h2>Players</h2>
                    <div id="players-list">
                    {gameState?.players?.map((player) => (
                        <>
                        <div className="lobby-list-item">
                            <span key={player.playerID}>
                                {player.name}
                                {player.isHost && (
                                    <span key={player.playerID + "-host"} className="lobby-dialog-extra-info"> (host)</span>
                                )}

                                {gameState?.you === player.playerID && (
                                    <span key={player.playerID + "-you"} className="lobby-dialog-extra-info"> (you)</span>
                                )}
                            </span>
                        </div>    
                        </>
                    ))}
                    </div>
                </div>
                
                <div id="lobby-game-code-container">
                    <div id="lobby-game-code-spacing"></div>
                    <h2 className="lobby-game-code">GAME CODE:</h2>
                    <h2 className="lobby-game-code">{gameState?.roomID}</h2>                   
                </div>

                <div id="actions-list">
                    <button className="confirm-button lobby-action-button" disabled={!canStartGame()} onClick={onStartButtonClick}>Start game</button>
                    <button className="confirm-button lobby-action-button" onClick={onLeaveButtonClick}>Leave</button>
                </div>
            </span>
            <span id="lobby-dialog-bottom">
                <h3>Server messages</h3>
                <div id="messages-list">
                    {Array.from(gameState?.messages).reverse().map((msg) => (
                        <p className="lobby-list-item">{msg}</p>
                    ))}
                </div> 
            </span>

            <span id="lobby-dialog-chatbox-container">
                <input type="text" id="lobby-dialog-textbox" onKeyDown={onTextboxKeyDown} placeholder={"Send a message..."} ref={inputRef}></input>
                <button id="lobby-dialog-chatbox-send-button" className="confirm-button" onClick={onSendMessageButtonClick}>Send</button>
            </span>

            {gameState?.gameStatus === "COUNTDOWN" && (
                <Modal>
                    <div id="lobby-countdown-container">
                        <h1>{gameState?.timer}</h1>
                    </div>
                </Modal>
            )}

            {gameState?.winner && (
                <Modal>
                    <EndDialog />
                </Modal>
            )}
            
        </>

    )
}

export default LobbyDialog;