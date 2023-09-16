const pool = require('../database/db.js')

const updateUserInfo = (request, response) => {
    const { user_id, new_username, new_email, new_password_hash, new_bio, new_date_of_birth } = request.body
    // Check if user_id is provided
    if (!user_id) {
        response.status(400).json({ error: 'user_id is required.' })
        return
    }

    // Construct the SQL query based on which fields are provided for update
    const updateFields = []
    const values = [user_id]

    if (new_username !== undefined) {
        updateFields.push('username = $' + (values.length + 1))
        values.push(new_username)
    }

    if (new_email !== undefined) {
        updateFields.push('email = $' + (values.length + 1))
        values.push(new_email)
    }

    if (new_password_hash !== undefined) {
        updateFields.push('password_hash = $' + (values.length + 1))
        values.push(new_password_hash)
    }

    if (new_bio !== undefined) {
        updateFields.push('bio = $' + (values.length + 1))
        values.push(new_bio)
    }

    if (new_date_of_birth !== undefined) {
        updateFields.push('date_of_birth = $' + (values.length + 1))
        values.push(new_date_of_birth)
    }

    // Check if any fields were provided for update
    if (updateFields.length === 0) {
        response.status(400).json({ error: 'No fields provided for update.' })
        return
    }

    // Construct the SQL query and execute the update
    const query = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE user_id = $1
        RETURNING user_id;`

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error updating user information:', error)
            response.status(500).json({ error: 'Internal server error' })
        } else if (results.rowCount === 0) {
            response.status(404).json({ error: 'User not found.' })
        } else {
            response.status(200).json({ message: 'User information updated successfully.' })
        }
    })
}

module.exports = { updateUserInfo }