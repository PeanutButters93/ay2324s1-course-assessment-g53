const pool = require("./database/db.js");
const amq = require("amqplib")
const axios = require("axios")

const addToQueue = async (user_id, difficulty) => {
  const values = [user_id, difficulty];

  //Not sure how this line is supposed to look like uh but roughly it will be like this
  const query = `INSERT INTO queue (user_id, difficulty) VALUES ($1, $2) RETURNING user_id`;
  try {
    const { rows } = await pool.query(query, values);
    return rows.length !== 0;
  } catch {
    return false;
  }
};

const findFromQueue = async (userId, difficulty, connection) => {
  const query = `SELECT user_id FROM queue WHERE difficulty = $1 LIMIT 1`;
  try {
    const { rows } = await pool.query(query, [difficulty]);
    if (rows.length === 0) return null;
    const matchedUserId = rows[0].user_id;
    const removed = removeFromQueue(matchedUserId);
    if (!removed) {
      return null
    }
    
    const room_id = await get_room_id(userId, matchedUserId);
    notifyWaitingUser(connection, matchedUserId, room_id);
    return room_id;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

const removeFromQueue = async (user_id) => {
  const query = `DELETE FROM queue WHERE user_id = $1`;
  const { rowCount } = await pool.query(query, [user_id]);
  return rowCount > 0;
};

async function notifyWaitingUser(connection, matchedUserId, room_id) {
  const channel = await connection.createChannel();
  channel.publish("match-events", matchedUserId.toString(), Buffer.from(room_id.toString()));
}

const COLLAB_HOST = process.env.COLLAB_HOST ? process.env.COLLAB_HOST : "http://localhost:9000"

async function get_room_id(user1, user2) {
  return axios.post(COLLAB_HOST + "/api/collab/get_room_id", {
    user1: user1,
    user2: user2,
  }, {headers: {
    "Content-Type": "application/json",
  }})
    .then((response) => {
      const {room_id} = response.data
      return room_id
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    })
}

module.exports = { findFromQueue, addToQueue, removeFromQueue };

