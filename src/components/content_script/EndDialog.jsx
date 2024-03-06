import React, { useContext } from "react";
import { GameStateContext } from "./ContentScriptApp.jsx";
import "./EndDialog.css";
import "../common/buttons.css";

const losePicture = "https://i.imgur.com/5KNnIgU.png";
const winPicture = "https://i.imgur.com/cFZeKpn.png";
const EndDialog = () => {
    const gameState = useContext(GameStateContext);

    const onClick = () => {
        window.location.reload();
    }

    return (
        <div id="end-dialog-container">
            {gameState.winner === "TIE" && (
                <h2>It was a tie!</h2>
            )}

            {gameState.winner === gameState.you && (
                <>
                    <h2>You won!</h2>
                    <img src={winPicture} height={"50%"} width={"50%"} />
                </>
            )}

            {gameState.winner !== gameState.you && gameState.winner !== "TIE" && (
                <>
                    <h2>You lost!</h2>
                    <img src={losePicture} height={"50%"} width={"50%"} />
                </>
            )}

            <button className="confirm-button end-dialog-button" onClick={onClick}>Ok</button>

            
        </div>
    )
}

export default EndDialog;