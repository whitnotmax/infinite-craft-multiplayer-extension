import React, { useState, useEffect } from "react"

export const useContent = () => {
  const [content, setContent] = useState();

  const sendCommand = (command) => {
  // send message to content.js to get current content
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: command },
      function (response) {
        console.log({ response })
        setContent(response.content)
        }
      )
    });
  }

return [content, sendCommand]
}
