import React, { useState, useEffect } from 'react';

const useLocalStorageValue = (key) => {
    const [value, setValue] = useState();



    const updateValue = () => {
        chrome.storage.local.get((items) => {
            setValue(items[key]); 
        });
    }
    useEffect(() => {
        chrome.storage.onChanged.addListener(function(changes, area) {
            updateValue();
        });

        updateValue();

    }, []);

    const setLocalStorageValue = (val) => {
        chrome.storage.local.set({
            [key]: val
        });
    }
    return [value, setLocalStorageValue];
}

export default useLocalStorageValue;