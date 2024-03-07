import React, { useState, useEffect } from 'react';

const useLocalStorageValue = (key, defaultValue = undefined) => {
    const [value, setValue] = useState();



    const updateValue = () => {
        chrome.storage.local.get((items) => {
            if (items[key] != null && items[key] != undefined) {
                setValue(items[key]); 
            } else {
                setValue(defaultValue);
            }
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