import React, { useState, useEffect } from 'react';

const useCurrentTab = () => {
    const [tab, setTab] = useState();

    useEffect(() => {
        let queryOptions = { active: true };
        chrome.tabs.query(queryOptions, ([currentTab]) => {
          if (chrome.runtime.lastError)
          console.error(chrome.runtime.lastError);
          // `currentTab` will either be a `tabs.Tab` instance or `undefined`.
          if (currentTab) {
            setTab(currentTab);
          }
        });
    }, []);
    
    return tab;    
}


export default useCurrentTab;

