const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const {validateUser} = require("./validation.js")

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const checkForMatch = (difficulty) => {
  //check the database
  

} 

const handleNoMatchFound = (difficulty, token) => {
  //add the user to the database
}



io.on('connection', (event, x) => {
  console.log('a user connected');
  const difficulty = event.handshake.query.difficulty
  const token = event.handshake.query.token
  let userId = validateUser(token)
  if (!userId) {
    console.log("Invalid token was received")
  }

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});