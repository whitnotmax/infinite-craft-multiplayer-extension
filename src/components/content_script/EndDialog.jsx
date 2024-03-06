import React, { useContext } from "react";
import { GameStateContext } from "./ContentScriptApp";

const gameState = useContext(GameStateContext);
const EndDialog = () => {
    return (
        <div id="end-dialog-container">
            {gameState?.winner === "TIE" && (
                <>
                    <h2>It was a tie!</h2>
                    <button>Ok</button>
                </>
            )}
        </div>
    )
}

export default EndDialog;