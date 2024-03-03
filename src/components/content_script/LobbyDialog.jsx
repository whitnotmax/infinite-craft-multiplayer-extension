import React, { useEffect, useState } from "react";
import Modal from "./Modal.jsx";
import "./LobbyDialog.css";
import "../common/buttons.css";
const LobbyDialog = () => {
    const [players, setPlayers] = useState(["Player1", "Player2"]);
    const [serverMessages, setServerMessages] = useState(["hi"]);

    useEffect(() => {
        setTimeout(() => {
            let arr = Array.from(serverMessages);
            arr.push("hi " + Math.random());
            setServerMessages(arr);
        }, 1000);
    })
    return (
        <>
            <span id="lobby-dialog-top">
                <div id="players-list-container">
                    <h2>Players</h2>
                    <div id="players-list">
                    {players.map((player) => (
                        <p key={Math.random()} className="lobby-list-item">{player}</p>
                    ))}
                    </div>
                </div>
                
                <div id="lobby-game-code-container">
                    <div id="lobby-game-code-spacing"></div>
                    <h2 className="lobby-game-code">GAME CODE:</h2>
                    <h2 className="lobby-game-code">1234</h2>                   
                </div>

                <div id="actions-list">
                    <button className="confirm-button lobby-action-button">Start game</button>
                    <button className="confirm-button lobby-action-button">Leave</button>
                </div>
            </span>
            <span id="lobby-dialog-bottom">
                <h3>Server messages</h3>
                <div id="messages-list">
                    {Array.from(serverMessages).reverse().map((msg) => (
                        <p key={Math.random()} className="lobby-list-item">{msg}</p>
                    ))}

                    
                </div>
                        
            </span>
        </>

    )
}

export default LobbyDialog;