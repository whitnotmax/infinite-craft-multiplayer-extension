import React, { useState, useEffect } from "react";
import "./PopupApp.css";
import useCurrentTab from "./hooks/useCurrentTab";
import useLocalStorageValue from "./hooks/useLocalStorageValue";
import { useContent } from "./hooks/useContent";

const PopupApp = () => {
    const INFINITE_CRAFT_URL = "https://neal.fun/infinite-craft/";
    const tab = useCurrentTab();
    const [isMultiplayerMode, setIsMultiplayerMode] = useLocalStorageValue("is_multiplayer");
    const [contentScript, sendCommand] = useContent();
    const isInfiniteCraft = tab?.url ==  INFINITE_CRAFT_URL;
    
    const handleButtonClick = () => {
        if (isInfiniteCraft) {
            setIsMultiplayerMode(!isMultiplayerMode);
            sendCommand("reload");
            window.close();
        }
    }

    return (
        <main>
            {isInfiniteCraft ? (
                <>
                <span>You are playing Infinite Craft in <strong>{isMultiplayerMode ? "multiplayer" : "singleplayer"}</strong> mode.</span>
                <button onClick={handleButtonClick} disabled={!isInfiniteCraft}>
                    {isInfiniteCraft ? `Reload in ${isMultiplayerMode ? "single": "multi"}player mode`
                        : "You are not on Infinite Craft!" }
                </button>
                </>
                
            ) : (
            <>
            <p>You are not playing Infinite Craft!</p>
            </>)}

        </main>
    )
}

export default PopupApp;