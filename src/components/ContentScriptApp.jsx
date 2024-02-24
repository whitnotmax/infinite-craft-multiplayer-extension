import React, { useState, useEffect } from "react";
import useLocalStorageValue from "./hooks/useLocalStorageValue";

const DEFAULT_DATA = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}'
const DATA_LOCALSTORAGE_KEY = 'infinite-craft-data';

const ContentScriptApp = () => {
    const [savedCrafts, setSavedCrafts] = useLocalStorageValue("saved_crafts");
    const [isMultiplayerMode, setIsMultiplayerMode] = useLocalStorageValue("is_multiplayer");  
    
    let oldData = null;

    const checkForChanges = () => {
        if (localStorage[DATA_LOCALSTORAGE_KEY] != oldData && localStorage[DATA_LOCALSTORAGE_KEY] != DEFAULT_DATA) {
            oldData = localStorage[DATA_LOCALSTORAGE_KEY];
            console.log("list change!");
            setSavedCrafts(localStorage[DATA_LOCALSTORAGE_KEY]);
        }
    }
    
    useEffect(() => {
        chrome.runtime.onMessage.addListener((data, sender) => {
            console.log(data);
            if (data.message === "reload") {
                window.location.reload();
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
    return (
        <>
            
        </>
    )
}

export default ContentScriptApp;