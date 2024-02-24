import React, { useState, useEffect } from 'react';

const useLocalStorageValue = (key) => {
    const [value, setValue] = useState();



    const updateValue = () => {
        chrome.storage.local.get((items) => {
            console.log(items);
            console.log(items[key]);
            setValue(items[key]); 
        });
    }
    useEffect(() => {
        chrome.storage.onChanged.addListener(function(changes, area) {
            console.log("storage change");
            updateValue();
        });

        updateValue();

    }, []);

    const setLocalStorageValue = (val) => {
        console.log("Hook set called");
        chrome.storage.local.set({
            [key]: val
        });
    }
    return [value, setLocalStorageValue];
}

export default useLocalStorageValue;