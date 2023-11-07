const express = require("express");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const Document = require("../Document")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const amq = require("amqplib")

dotenv.config({
    path: ".env.local"
})
const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost/document_db"
mongoose.connect(MONGODB_URI)

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST ? process.env.RABBIT_MQ_HOST : 'amqp://guest:guest@localhost:5672'
const queueName = "questionHistoryAddEntry"

router.post("/save_solution", async (req, res) => {
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
})

router.post("/get_document", async (req, res) => {
    const {documentID} = req.body
    var document = await Document.findById(documentID)
    res.send({ document : JSON.stringify(document)})
})

router.post("/get_document_raw", async (req, res) => {
    console.log("Submitting code...")
    const {documentID} = req.body
    var document = await Document.findById(documentID)
    document = document.data.ops.map(item => item.insert).join('')
    res.send({ document : document})
})

router.post("/get_room_id", async (req, res) => {
    // User ids are not used. Could have a future use.
    const {user1, user2} = req.body

    var room_id = null
    var document = null

    do {
        room_id = uuidv4()
        document = await Document.findById(room_id)
    } while (document)

    res.send({ room_id : room_id})
})

module.exports = router;