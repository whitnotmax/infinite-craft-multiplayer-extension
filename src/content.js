import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";

const domRoot = document.createElement("div");
domRoot.id = "extension-root";
document.body.appendChild(domRoot);

const root = createRoot(domRoot);
root.render(<App/>);
