const pool = require('../database/db.js')
const { verifyJsonWebToken } = require('../middleware/tokenUtils')

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {

    const token = request.headers.authorization;
    let user_id;

    try {
        user_id = verifyJsonWebToken(token).user_data.user_id;
    } catch(error) {
        console.log(error.message);
        return response.status(401).json({ error: 'Unauthorised' });
    }
    // Check if user_id is a valid integer
    if (isNaN(user_id)) {
        return response.status(400).json({ error: 'Invalid user_id format' })
    }
    pool.query('SELECT * FROM users WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            return response.status(404).json({ error: 'No users found' })
        }
        return response.status(200).json(results.rows)
    })
}

const getUserByName = (request, response) => {
    const username = request.query.username
    pool.query("SELECT * FROM users WHERE username ILIKE '%' || $1 || '%'", [username], (error, results) => {
        if (error) {
            console.log(error);
            console.error('Error retrieving user:', error)
            return response.status(500).json({ error: 'Internal server error' })
        } else if (results.rows.length === 0) {
            return response.status(404).json({ error: 'User not found' })
        } else {
            return response.status(200).json(results.rows)
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
            // console.log(user)
            const isMatch = await bcrypt.compare(password, user.password)  // assuming the password column is named 'password'
            if (isMatch) {
                const claims = {
                    "user_id":results.rows[0].user_id,
                    "is_admin":results.rows[0].is_admin,
                }
                const token = jwt.sign({ "user_data": claims }, 'yourSecretKey', { expiresIn: '1h' })
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
                        const claims = {
                            "user_id":results.rows[0].user_id,
                            "is_admin":results.rows[0].is_admin,
                        }
                        const token = jwt.sign({ "user_data": claims }, 'yourSecretKey', { expiresIn: '1h' })
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