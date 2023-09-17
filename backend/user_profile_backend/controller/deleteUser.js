const pool = require('../database/db.js')

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
    deleteUserByUserID
}