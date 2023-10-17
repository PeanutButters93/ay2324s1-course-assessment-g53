const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config({
  path: ".env.local",
});
const DEFAULT_DOCUMENT_DATA = "";
const PORT = process.env.PORT ? process.env.PORT : 9001;
const FRONTEND_HOST = process.env.FRONTEND_HOST
  ? process.env.FRONTEND_HOST
  : "http://localhost:3000";

const app = express();
const server = require("http").createServer(app);
app.use(cors());
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: FRONTEND_HOST,
    methods: ["GET", "POST"],
  },
});
server.listen(PORT, () => {
  console.log(`Communication service connected on port ${PORT}`);
});

let count = 0;
io.on("connection", (socket) => {
  console.log("One person connected", count++);

  socket.on("join-room", (roomId, userId, callback) => {
    socket.join(roomId);
    console.log("joined", roomId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });

    socket.on("video-ready", () => {
      console.log("Video ready");
      socket.to(roomId).emit("user-connected", userId);
    });
    callback()
  });
});
