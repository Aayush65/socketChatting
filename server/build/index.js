"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const socket_io_1 = require("socket.io");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "http://localhost:5173" } });
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => res.send("Hello World!!"));
io.on('connect', socket => {
    const id = socket.id;
    let name = "";
    socket.on("name", message => {
        name = message;
        console.log(`User ${name} connected`);
        io.emit('message', { id: 0, name: "", msg: `${name} has joined the chat` });
    });
    socket.on("message", message => {
        message.id = id;
        io.emit('message', message);
    });
    socket.on('disconnect', () => {
        if (!name)
            return;
        console.log(`${name} User disconnected`);
        io.emit('message', { id: 0, name: "", msg: `${name} has left the chat` });
    });
});
server.listen(process.env.PORT || 3000, () => {
    console.clear();
    console.log(`Listening on Port ${process.env.PORT || 3000}`);
});
