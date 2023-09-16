const pool = require('../database/db.js')

const createUser = (request, response) => {
    const { username, email, password, bio, date_of_birth } = request.body

    // Create an array to hold the values and an array to hold the placeholders
    const values = [username, email, password]
    const placeholders = ['$1', '$2', '$3']
    const fields = ['username', 'email', 'password']

    // Check if bio is provided and add it to the values and placeholders arrays
    if (bio !== undefined) {
        values.push(bio)
        fields.push('bio')
        placeholders.push('$' + (values.length))
    }

    // Check if date_of_birth is provided and add it to the values and placeholders arrays
    if (date_of_birth !== undefined) {
        values.push(date_of_birth)
        fields.push('date_of_birth')
        placeholders.push('$' + (values.length))
    }

    const query = `INSERT INTO users (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING user_id`

    pool.query(query, values, (error, results) => {
        if (error) {
            if (error.code === '23505' && error.constraint === 'unique_username') {
                // This error code (23505) corresponds to a unique constraint violation
                response.status(400).json({ error: 'Username is already taken' })
            } else if (error.constraint === 'check_password_complexity') {
                // This error corresponds to the password complexity constraint
                response.status(400).json({ error: 'Password does not meet complexity requirements' })
            } else {
                console.error('Error creating user:', error)
                response.status(500).json({ error: 'Internal server error' })
            }
        } else {
            response.status(201).json({ message: `User added with ID: ${results.rows[0].user_id}` })
        }
    })
}

module.exports = { createUser }
