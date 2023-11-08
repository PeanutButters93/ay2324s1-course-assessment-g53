// Import the Question model from its file path
const Question = require("../model/QuestionHistory");
const amq = require("amqplib")

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST ? process.env.RABBIT_MQ_HOST : 'amqp://guest:guest@localhost:5672'
const queueName = "questionHistoryAddEntry"

// Define the getQuestions function
const createAddEntryEvent  = async (req, res) => {
  try {
    const msg = req.body
    const connection = await amq.connect(RABBIT_MQ_HOST)
    const channel = await connection.createChannel()

    try {
        await channel.assertQueue(queueName)
    } catch (error) {
        console.log(error)
    }
    channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(msg))
    )
  } catch (err) {
    // Log the error and return a 500 status code
    console.error(err);
    res.status(500).send("Error retrieving questions: " + err.message);
  }
};

module.exports = {
  createAddEntryEvent,
};
