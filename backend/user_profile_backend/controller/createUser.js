const pool = require('../database/db.js')

const createUser = async(request, response) => {
    const { username, email, password, bio, date_of_birth, firstName, lastName } = request.body

    const jwt = require('jsonwebtoken')
    const bcrypt = require('bcrypt');

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const fields = ['username', 'email', 'password', 'first_name', 'last_name'];
    const values = [username, email, hashedPassword, firstName, lastName];
    const placeholders = values.map((_, index) => `$${index + 1}`);

    if (bio !== undefined) {
        values.push(bio);
        fields.push('bio');
        placeholders.push(`$${values.length}`);
    }

    if (date_of_birth !== undefined) {
        values.push(date_of_birth);
        fields.push('date_of_birth');
        placeholders.push(`$${values.length}`);
    }

    const query = `INSERT INTO users (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING user_id`;

    pool.query(query, values, (error, results) => {
        if (error) {
            if (error.code === '23505' && error.constraint === 'unique_username') {
                // This error code (23505) corresponds to a unique constraint violation
                response.status(400).json({ error: 'Username is already taken' })
            } else if (error.constraint === 'check_password_complexity') {
                // This error corresponds to the password complexity constraint
                response.status(400).json({ error: 'Password does not meet complexity requirements' })
            } else {
                console.log(error)
                console.error('Error creating user:', error)
                response.status(500).json({ error: 'Internal server error' })
            }
        } else {
            const claims = {
                "user_id":results.rows[0].user_id,
                "is_admin":false,
            }
            const token = jwt.sign({ "user_data": claims }, 'yourSecretKey', { expiresIn: '1h' })
            response.status(201).json({
                message: `User added with ID: ${results.rows[0].user_id}` ,
                token
            })
        }
    })
}

module.exports = { createUser }
