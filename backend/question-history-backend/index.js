const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const amqp = require("amqplib")
const jwt = require("jsonwebtoken");

const historyRouter = require('./routes/historyRouter')
dotenv.config({
    path: ".env.local"
})

const app = express()
const PORT = process.env.PORT || 5000
const secretKey = "yourSecretKey"

app.use(cors())

app.use("/api/history", historyRouter)
app.use("/", (req, res) => res.status(200).json({status: "OK"}))
app.listen(PORT, () => {
    console.log(`Question history service connected on port ${PORT}`);
});


const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST ? process.env.RABBIT_MQ_HOST : 'amqp://guest:guest@localhost:5672'
const AddEntryQueue = "questionHistoryAddEntry"
const DeleteUserQueue = "deleteUserQueue"

async function startAmqp() {
  // Connect to RabbitMQ
  const connection = await amqp.connect(RABBIT_MQ_HOST);
  const channel = await connection.createChannel();
  startAddEntryQueue(channel);
  startDeleteUserQueue(channel);
}



async function startAddEntryQueue(channel) {
    try {
  
      // Declare a queue (must match the queue you want to consume from)
      await channel.assertQueue(AddEntryQueue);
  
      // Consume messages from the queue
      channel.consume(AddEntryQueue, (message) => {
        if (message.content) {
          const messageData = JSON.parse(message.content.toString('utf-8'));

          var token = messageData.user_cookie
          
          try {
            const user_id = jwt.verify(token, secretKey).user_data.user_id;
            console.log(user_id)
            console.log(messageData.question)
            console.log(messageData.attempt)
            console.log(messageData.timestamp)
          } catch (e) {
            console.log(e)
          } finally {
            // Acknowledge the message to remove it from the queue
            channel.ack(message);
          }

        }
      });
  
      console.log(`Consumer is listening for messages in the "${AddEntryQueue}" queue.`);
    } catch (error) {
      console.error('Error starting consumer:', error);
    }
}

async function startDeleteUserQueue(channel) {
    try {
  
      // Declare a queue (must match the queue you want to consume from)
      await channel.assertQueue(DeleteUserQueue);
  
      // Consume messages from the queue
      channel.consume(DeleteUserQueue, (message) => {
        if (message.content) {
          const messageData = JSON.parse(message.content.toString('utf-8'));
          console.log(messageData)
        }
      });
  
      console.log(`Consumer is listening for messages in the "${DeleteUserQueue}" queue.`);
    } catch (error) {
      console.error('Error starting consumer:', error);
    }
}

startAmqp()