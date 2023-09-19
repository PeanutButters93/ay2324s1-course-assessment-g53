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
    const id = parseInt(request.query.user_id)
    console.log(id)
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserByName = (request, response) => {
    const username = request.query.username
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

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const loginUser = async (request, response) => {
    const { userIdentifier, password } = request.body

    pool.query('SELECT * FROM users WHERE username = $1', [userIdentifier], async (error, results) => {
        if (error) {
            response.status(500).json({ error: 'Internal server error' })
        } else if (results.rows.length > 0) {
            const user = results.rows[0]
            const isMatch = await bcrypt.compare(password, user.password)  // assuming the password column is named 'password'
            if (isMatch) {
                const token = jwt.sign({ userId: user.id }, 'yourSecretKey', { expiresIn: '1h' })
                response.json({ token })
            } else {
                response.status(403).json({ error: 'Incorrect password' })
            }
        } else {
            pool.query('SELECT * FROM users WHERE email = $1', [userIdentifier], async (error, results) => {
                if (error) {
                    response.status(500).json({ error: 'Internal server error' })
                } else if (results.rows.length > 0) {
                    const user = results.rows[0]
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (isMatch) {
                        const token = jwt.sign({ userId: user.id }, 'yourSecretKey', { expiresIn: '1h' })
                        response.json({ token })
                    } else {
                        response.status(403).json({ error: 'Incorrect password' })
                    }
                } else {
                    response.status(404).json({ error: 'User not found' })
                }
            })
        }
    })
}



module.exports = {
    getUsers,
    getUserById,
    getUserByName,
    loginUser
}