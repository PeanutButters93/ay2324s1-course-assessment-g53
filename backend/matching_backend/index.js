const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { validateUser } = require("./validation.js");
const { addToQueue, findFromQueue } = require("./queuing-handlers.js")

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});


io.on("connection", async (event, x) => {
  const difficulty = event.handshake.query.difficulty;
  const token = event.handshake.auth.token;
  let userId = await validateUser(token);
  if (!userId) {
    event.conn.close()
    return;
  }
  const matchedId = findFromQueue(difficulty)
  if (matchedId) {
    // send information
    event.emit("hello", {matchedId})
    event.conn.close()
    return;
  }

  addToQueue(userId, difficulty)
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
