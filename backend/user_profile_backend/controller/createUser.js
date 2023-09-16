const pool = require('../database/db.js')

const createUser = (request, response) => {
    const { username, email, password_hash, bio, date_of_birth } = request.body

    // Create an array to hold the values and an array to hold the placeholders
    const values = [username, email, password_hash]
    const placeholders = ['$1', '$2', '$3']
    const fields = ['username', 'email', 'password_hash']

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
            console.error('Error creating user:', error)
            response.status(500).json({ error: 'Internal server error' })
        } else {
            response.status(201).json({ message: `User added with ID: ${results.rows[0].user_id}` })
        }
    })
}

module.exports = { createUser }
