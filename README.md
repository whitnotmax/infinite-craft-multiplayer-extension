# Infinite Craft Multiplayer Extension

A browser extension that adds an interactive multiplayer racing mode to the browser game Infinite Craft.

![Screenshot](https://i.imgur.com/aIOKf3i.png)
![Screenshot](https://i.imgur.com/m6vmqnC.png)

The browser extension introduces a new Multiplayer mode that can be toggled through the extension popup window. Playing the game normally is still possible, since the extension preserves the progress that you made before enabling multiplayer mode, and restores it once you return to singleplayer mode.

![Screenshot](https://i.imgur.com/71TuTUo.png)

## Running the extension
The extension is compiled using Webpack, and will be built into the `dist` directory. Build using `yarn build`, or use `yarn dev` to automatically build when the code changes.

To install the extension in the browser, enable developer mode, select "Load unpacked extension," and select the dist folder. 

**For more info, see the README of [this repo](https://github.com/whitnotmax/create-react-chrome-extension).**

You can change the URL of the server that the extension connects to by right-clicking the extension icon and accessing the options page (by default, it tries to connect to localhost).

If you want to uninstall the extension and you care about your progress, make sure to return to singleplayer mode first (to restore your progress), otherwise it will be lost!

## Running the server
The server code is located in the `server` directory. Run `yarn start-server` to automatically reload when the server code changes. 

If you have set up an SSL certificate for your server using certbot or a similar tool, you can put the path to the private key file into the `PRIVATE_KEY` environment variable, the path to the public key in the `CERT` environment variable, and the path to the certificate chain file into the `CA` environment variable. If these files are present, the server will start up an HTTPS server.

**If you want to host a server somewhere other than `localhost`, you must have an SSL certificate set up.** Otherwise, the browser will refuse to connect. The Infinite Craft game is hosted on an HTTPS website, so Chrome will not allow extensions to connect to insecure URLs. 