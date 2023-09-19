const pool = require('../database/db.js')

const updateUserInfo = (request, response) => {
    const { user_id, new_username, new_email, new_password, new_bio, new_date_of_birth } = request.body
    // Check if user_id is provided
    if (!user_id) {
        response.status(400).json({ error: 'user_id is required.' })
        return
    }
    const parsedUserId = parseInt(user_id)

    // Check if user_id is a valid integer
    if (isNaN(user_id)) {
        response.status(400).json({ error: 'Invalid user_id format' })
        return
    }

    // Construct the SQL query based on which fields are provided for update
    const updateFields = []
    const values = [parsedUserId]

    if (new_username !== undefined && new_username !== "") {
        updateFields.push('username = $' + (values.length + 1))
        values.push(new_username)
    }

    if (new_email !== undefined && new_email !== "") {
        updateFields.push('email = $' + (values.length + 1))
        values.push(new_email)
    }

    if (new_password !== undefined && new_password !== "") {
        updateFields.push('password = $' + (values.length + 1))
        values.push(new_password)
    }

    if (new_bio !== undefined && new_bio != "") {
        updateFields.push('bio = $' + (values.length + 1))
        values.push(new_bio)
    }

    if (new_date_of_birth !== undefined && new_date_of_birth !== undefined) {
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
            if (error.code === '23505' && error.constraint === 'unique_username') {
                // This error code (23505) corresponds to a unique constraint violation
                response.status(400).json({ error: 'Username is already taken' })
            } else if (error.constraint === 'check_password_complexity') {
                // This error corresponds to the password complexity constraint
                response.status(400).json({ error: 'Password does not meet complexity requirements' })
            } else {
                console.error('Error updating user information:', error)
                response.status(500).json({ error: 'Internal server error' })
            }
        } else if (results.rowCount === 0) {
            response.status(404).json({ error: 'User not found.' })
        } else {
            response.status(200).json({ message: 'User information updated successfully.' })
        }
    })
}

module.exports = { updateUserInfo }