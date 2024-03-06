const textbox = document.getElementById("textbox");
const button = document.getElementById("save-button");

chrome.storage.local.get((items) => {
    if (items["server_URL"]) {
        textbox.value = items["server_URL"]; 
    }
});

button.addEventListener("click", () => {
    chrome.storage.local.set({ "server_URL": textbox.value }, () => {
        alert("Changes saved!");
        window.location.reload();
    });
});