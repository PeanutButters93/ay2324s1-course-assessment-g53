const pool = require('../database/db.js')
const amq = require("amqplib")

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST ? process.env.RABBIT_MQ_HOST : 'amqp://guest:guest@localhost:5672'
const queueName = "deleteUserQueue"

const deleteUserByUserID = async (request, response) => {
    console.log(request.body);
    const id = request.body.user_data.user_id;
    console.log(id);

    const connection = await amq.connect(RABBIT_MQ_HOST)
    const channel = await connection.createChannel()
    try {
        await channel.assertQueue(queueName)
    } catch (error) {
        console.log(error)
    }

    pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount === 0) {
            response.status(404).send(`No user found with ID: ${id}`)
        } else {
            response.status(200).send(`User deleted with ID: ${id}`)
            channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(id))
            )
        }
    })
}

module.exports = {
    deleteUserByUserID
}