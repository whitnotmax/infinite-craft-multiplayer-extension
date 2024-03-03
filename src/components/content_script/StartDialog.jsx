import React, { useRef } from "react";
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
            <section>
                <h3>Create a game</h3>
                <div className="centered">
                    <p>This will create a game code that the other player will use to join.</p>
                    <button className="confirm-button">Go</button>
                </div>
            </section>

            <section id="divider">
                <div id="vertical-line" />
            </section>

            <section>
                <h3>Join a game</h3>
                <div className="centered">
                    <p>Enter the game code given to you by the other player.</p>
                    <input type="text" onKeyDown={onKeyDown} ref={inputRef}></input>
                </div>

                <div className="centered">
                    <button className="confirm-button" onClick={onClick}>Go</button>
                </div>
            </section>
        </span>
    )
}

export default StartDialog;