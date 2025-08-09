const liveServer = require("live-server");

const params = {
    port: 3000,
    host: "0.0.0.0",
    root: "./",
    open: false,
    file: "index.html",
    wait: 1000,
    logLevel: 2
};

console.log("Starting development server on http://localhost:3000");
liveServer.start(params);