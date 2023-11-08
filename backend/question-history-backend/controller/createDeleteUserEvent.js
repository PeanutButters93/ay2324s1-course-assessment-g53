// Import the Question model from its file path
const Question = require("../model/QuestionHistory");
const amq = require("amqplib")

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST ? process.env.RABBIT_MQ_HOST : 'amqp://guest:guest@localhost:5672'
const queueName = "deleteUserQueue"

// Define the getQuestions function
const createDeleteUserEvent  = async (req, res) => {
  try {
    console.log("function is executed");
    // // Extract userID from the request parameters
    const userID = req.params.userID;

    const connection = await amq.connect(RABBIT_MQ_HOST)
    const channel = await connection.createChannel()

    try {
        await channel.assertQueue(queueName)
    } catch (error) {
        console.log(error)
    }

    channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(userID))
    )

  } catch (err) {
    // Log the error and return a 500 status code
    console.error(err);
    res.status(500).send("Error retrieving questions: " + err.message);
  }
};

module.exports = {
  createDeleteUserEvent,
};
