import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal.jsx";
import "./StartDialog.css";
import "../common/buttons.css";
const StartDialog = () => {
    const inputRef = useRef();

    const onKeyDown = (e) => {
        e.stopPropagation();
    }

    const onClick = () => {
        console.log(inputRef.current.value);
    }
    return (
        <span id="start-dialog">
            <section className="start-dialog-section">
                <h3 className="start-dialog-header">Create a game</h3>
                <div className="centered">
                    <p className="start-dialog-text">This will create a game code that the other player will use to join.</p>
                    <button className="confirm-button start-dialog-button">Go</button>
                </div>
            </section>

            <section id="start-dialog-divider">
                <div id="vertical-line" />
            </section>

            <section className="start-dialog-section">
                <h3 className="start-dialog-header">Join a game</h3>
                <div className="centered">
                    <p className="start-dialog-text"> Enter the game code given to you by the other player.</p>
                    <input id="start-dialog-input" type="text" onKeyDown={onKeyDown} ref={inputRef}></input>
                </div>

                <div className="centered">
                    <button className="confirm-button start-dialog-button" onClick={onClick}>Go</button>
                </div>
            </section>

        </span>
    )
}

export default StartDialog;