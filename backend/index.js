import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Env variables into process.env
dotenv.config();

// Initialize express app
const expressApp = express();

// General Middlewares
expressApp.use(express.json());
expressApp.use(express.static(path.resolve(__dirname, "../frontend/dist")));

// Initialize Http server
const httpServer = createServer(expressApp);

const io = new Server(httpServer);

// General Routes
expressApp.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

httpServer.on("error", (err) => {
    console.error("Server error:", err);
});

// Websocket Handle
io.on("connection", (socket) => {
    console.log(`User ${socket.id} has connected`);
    socket.broadcast.emit("chatMessage", `${socket.id} has connected`);

    socket.on("chatMessage", (data) => {
        io.emit("chatMessage", `${data.username}: ${data.message}`);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("chatMessage", `${socket.id} has been disconnected`);
        console.log(`User ${socket.id} has disconnected`);
    });
});

const serverPort = process.env.PORT || 3000;
httpServer.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
});