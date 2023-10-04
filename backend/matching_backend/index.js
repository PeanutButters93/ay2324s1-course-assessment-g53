const express = require("express");
const http = require("http");
const amq = require("amqplib")
const { Server } = require("socket.io");
const { validateUser } = require("./validation.js");
const { addToQueue, findFromQueue, removeFromQueue } = require("./queuing-handlers.js")

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let connection = null;
amq.connect('amqp://guest:guest@localhost:5672').then((amqConnection) => {
  connection = amqConnection;
})

async function waitForMatchInBackground(userId, event) {
  const channel = await connection.createChannel();
  const { exchange } = await channel.assertExchange("match-events", "topic");
  const { queue } = await channel.assertQueue(`user-queue-${userId}`, { exclusive: true });
  channel.purgeQueue(`user-queue-${userId}`)
  channel.bindQueue(queue, exchange, userId.toString());

  let matched = false
  event.on("disconnect", () => {
    if (matched) return
    removeFromQueue(userId)
    channel.close()
  })

  channel.consume(queue, (msg) => {
    matched = true
    console.log("Matched after wait:", userId, msg.content.toString());
    event.emit("hello", { matchedId: parseInt(msg.content.toString()) });
    channel.purgeQueue(`user-queue-${userId}`)
    event.conn.close();
  });
}

io.on("connection", async (event, x) => {
  const difficulty = event.handshake.query.difficulty;
  const token = event.handshake.auth.token;
  let userId = await validateUser(token);
  console.log('Matching:', userId)
  if (!userId) {
    event.conn.close()
    return;
  }
  
  const matchedId = await findFromQueue(userId, difficulty, connection)
  if (matchedId) {
    console.log("Matched without wait:", userId, matchedId)
    // send information
    event.emit("hello", {matchedId})
    event.conn.close()
    return;
  }

  waitForMatchInBackground(userId, event);
  addToQueue(userId, difficulty);
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
