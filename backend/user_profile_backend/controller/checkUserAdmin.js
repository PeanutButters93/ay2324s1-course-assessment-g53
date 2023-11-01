const pool = require('../database/db.js')

const checkUSerAdmin = (request, response) => {
    const username = request.body.user_data.username

    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length === 0) {
            // If no user is found with the provided user_id, send a 404 (Not Found) response.
            response.status(404).json({ error: 'User not found' })
        }
        return response.status(200).json({ is_admin: results.rows[0].is_admin })

    })
}

module.exports = {
    checkUSerAdmin
}
