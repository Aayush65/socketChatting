import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import { Server } from 'socket.io';


config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

app.use(express.json());
app.use(cors())

app.get("/", (req: Request, res: Response) => res.send("Hello World!!"));

io.on('connect', socket => {
    const id = socket.id;
    let name = "";

    socket.on("name", message => {
        name = message;
        console.log(`User ${name} connected`);
        io.emit('message', {id: 0, name: "", msg: `${name} has joined the chat`});
    });

    socket.on("message", message => {
        message.id = id;
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        if (!name)
            return
        console.log(`${name} User disconnected`);
        io.emit('message', {id: 0, name: "", msg: `${name} has left the chat`});
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.clear();
    console.log(`Listening on Port ${process.env.PORT || 3000}`)
});