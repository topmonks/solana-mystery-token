const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {cors: {origin: '*'}});

let sockets = [];
let interval;

io.on("connection", (socket) => {
    // Set new connection socket to array
    sockets.push(socket);
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        let i = sockets.indexOf(socket);
        if(i !== -1) {
            sockets.splice(i, 1);
        }
        console.log("Client disconnected");
        clearInterval(interval);
    });

    socket.on('walletConnect', (data) => {
        console.log(data);
        if(data){
            console.log(new Date().toISOString()+' Success:' + data);
        } else {
            console.log(new Date().toISOString()+' Error: no pubKey');
        }
    });
});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};



server.listen(port, () => console.log(`Listening on port ${port}`));