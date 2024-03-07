import React, { useContext, useEffect, useRef, useState } from "react";
import useLocalStorageValue from "../hooks/useLocalStorageValue.js";
import Modal from "./Modal.jsx";
import "./StartDialog.css";
import "../common/buttons.css";
import { WebSocketContext, GameStateContext } from "./ContentScriptApp.jsx";
const StartDialog = () => {
    const webSocket = useContext(WebSocketContext);
    const gameState = useContext(GameStateContext);
    const [serverURL, setServerURL] = useLocalStorageValue("server_URL");

    const inputRef = useRef();

    const onKeyDown = (e) => {
        e.stopPropagation();
    }


    const onCreateGameClick = () => {
        fetch(`${webSocket.httpProtocol}://${webSocket.location}:${webSocket.port}/new-game`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json().then(id => {
            webSocket.sendData("JOIN_GAME", { id: parseInt(id) });
        }));
    }
    const onJoinGameClick = () => {
        webSocket.sendData("JOIN_GAME", { id: parseInt(inputRef.current.value) });
    }



    return (
        <span id="start-dialog">
            <section className="start-dialog-section">
                <h3 className="start-dialog-header">Create a game</h3>
                <div className="centered">
                    <p className="start-dialog-text">This will create a game code that the other player will use to join.</p>
                    <button className="confirm-button start-dialog-button" onClick={onCreateGameClick}>Go</button>
                </div>
            </section>

            <section id="start-dialog-divider">
                <div id="vertical-line" />
            </section>

            <section className="start-dialog-section">
                <h3 className="start-dialog-header">Join a game</h3>
                <div className="centered">
                    <p className="start-dialog-text"> Enter the game code given to you by the other player.</p>
                    <input id="start-dialog-input" type="number" onKeyDown={onKeyDown} ref={inputRef}></input>
                </div>

                <div className="centered">
                    <button className="confirm-button start-dialog-button" onClick={onJoinGameClick}>Go</button>
                </div>
            </section>

        </span>

        
    )
}

export default StartDialog;