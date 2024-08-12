const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PouchDB = require("pouchdb");
const db = new PouchDB("chatDB");

app.use(express.static("public"));

let messages = []; // Array om berichten op te slaan

io.on("connection", (socket) => {
    console.log("A user connected");

    // Stuur de opgeslagen berichten naar de nieuwe gebruiker
    socket.emit("load messages", messages);

    socket.on("chat message", (msg) => {
        messages.push(msg); // Voeg het nieuwe bericht toe aan de array
        io.emit("chat message", msg); // Stuur het bericht naar alle clients
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
