const pool = require("./database/db.js");

const addToQueue = (user_id, difficulty) => {
  const values = [user_id, difficulty];

  //Not sure how this line is supposed to look like uh but roughly it will be like this
  const query = `INSERT INTO queue (user_id, difficulty) VALUES ($1, $2) RETURNING user_id`;
  pool.query(query, values, (error, results) => {
    if (error) {
      console.log(error.message);
      return;
    }
    console.log(`Added user with user_id: ${results.rows[0]} to queue`);
    return;
  });
};

const findFromQueue = (difficulty) => {
    const query = `SELECT user_id FROM queue WHERE difficulty = $1 LIMIT 1`
    pool.query(query, [difficulty], (error, results) => {
        if (error) {
            console.log(error.message)
            return;
        }
        if (results.rows.length === 0) {
            console.log("Nobody in the queue has this difficulty level...")
            return null
        }
        const matchedUserId = results.rows[0].user_id
        console.log("Matched user has ID: ", matchedUserId)
        return matchedUserId;
    })
}

module.exports = {findFromQueue, addToQueue}