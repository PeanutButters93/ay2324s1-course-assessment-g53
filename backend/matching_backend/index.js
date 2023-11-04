const express = require("express");
const http = require("http");
const amq = require("amqplib")
const cors = require('cors');
const { Server } = require("socket.io");
const { validateUser } = require("./validation.js");
const { addToQueue, findFromQueue, removeFromQueue } = require("./queuing-handlers.js")

const FRONTEND_HOST = process.env.FRONTEND_HOST ?  process.env.FRONTEND_HOST : "http://localhost:3000"
const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST ? process.env.RABBIT_MQ_HOST : 'amqp://guest:guest@localhost:5672'

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_HOST,
    methods: ["GET", "POST"],
  },
});

app.use("/api/matching", (req,res) => {res.status(200).json({status: "OK"})})

let connection = null;
amq.connect(RABBIT_MQ_HOST).then((amqConnection) => {
  console.log("connected to RabbitMQ")
  console.log(FRONTEND_HOST)
  connection = amqConnection;
})

async function waitForMatchInBackground(userId, event) {
  const channel = await connection.createChannel();
  const { exchange } = await channel.assertExchange("match-events", "topic");
  const { queue } = await channel.assertQueue(`user-queue-${userId}`, { exclusive: true, autoDelete: true });
  channel.bindQueue(queue, exchange, userId.toString());

  let matched = false
  channel.consume(queue, (msg) => {
    matched = true
    event.emit("hello", { room_id: msg.content.toString() });
    event.conn.close();
  });
  
  event.on("disconnect", () => { 
    channel.close();
    if (matched) return
    removeFromQueue(userId);
  })

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
  
  const room_id = await findFromQueue(userId, difficulty, connection)
  if (room_id) {
    console.log("Matched without wait:", userId, room_id)
    // send information
    event.emit("hello", {room_id})
    event.conn.close()
    return;
  }

  waitForMatchInBackground(userId, event);
  addToQueue(userId, difficulty);
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

io.on('connect_error', (e) => {
  console.log(e)
})