const pool = require('../database/db.js')

// todo: Check if currect user is admin, only admin user can set other user to admin

const setUserAdmin = (request, response) => {
    const username = request.query.username
    // console.log(username)

    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length === 0) {
            // If no user is found with the provided user_id, send a 404 (Not Found) response.
            response.status(404).json({ error: 'User not found' })
        } else {
            // Update the user's admin status to true
            pool.query('UPDATE users SET is_admin = true WHERE username = $1', [username], (error) => {
                if (error) {
                    throw error
                }
                response.status(200).json({ message: 'User is now an admin' })
            })
        }
    })
}

module.exports = {
    setUserAdmin
}