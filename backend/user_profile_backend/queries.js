const { user } = require('pg/lib/defaults')

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '34.87.116.20',
    database: 'user_profile',
    password: 'cs3219g53',
    port: 5432,
})

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



const updateUserName = (request, response) => {
    const { user_id, new_username } = request.body

    // Check if both user_id and new_username are provided
    if (!user_id || !new_username) {
        response.status(400).json({ error: 'Both user_id and new_username are required.' })
        return
    }

    pool.query(
        'UPDATE users SET username = $1 WHERE user_id = $2',
        [new_username, user_id],
        (error, results) => {
            if (error) {
                throw error
            }
            if (results.rowCount === 0) {
                response.status(404).json({ error: 'User not found.' })
            } else {
                response.status(200).json({ message: 'Username updated successfully.' })
            }
        }
    )
}

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


const deleteUserByUserID = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount === 0) {
            response.status(404).send(`No user found with ID: ${id}`)
        } else {
            response.status(200).send(`User deleted with ID: ${id}`)
        }
    })
}

module.exports = {
    getUsers,
    getUserByName,
    getUserById,
    createUser,
    updateUserName,
    deleteUserByUserID,
}