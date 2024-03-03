import React from "react";
import { createRoot } from "react-dom/client";
import ContentScriptApp from "./components/content_script/ContentScriptApp.jsx";

const domRoot = document.createElement("div");
domRoot.id = "extension-root";
document.body.appendChild(domRoot);

const root = createRoot(domRoot);
root.render(<ContentScriptApp/>);
