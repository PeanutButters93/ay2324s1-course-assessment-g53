const pool = require('../database/db.js')

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserByName = (request, response) => {
    const username = request.params.username

    pool.query('SELECT * FROM users WHERE username ILIKE $1', [username], (error, results) => {
        if (error) {
            console.error('Error retrieving user:', error)
            response.status(500).json({ error: 'Internal server error' })
        } else if (results.rows.length === 0) {
            response.status(404).json({ error: 'User not found' })
        } else {
            response.status(200).json(results.rows)
        }
    })
}

modules.exports = {
    getUsers,
    getUserById,
    getUserByName
}