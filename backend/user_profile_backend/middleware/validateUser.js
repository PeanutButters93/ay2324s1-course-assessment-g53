const axios = require('axios')
const { verifyJsonWebToken } = require('./tokenUtils')
const USER_HOST = process.env.USER_HOST ? process.env.USER_HOST : "http://localhost:4000/api/users"


async function validateUser (request, response, next) {
    const token = request.headers.authorization
    let user_id
    console.log(token)
    try {
        user_id = verifyJsonWebToken(token).user_data.user_id
        if (!user_id) {
            return response.status(401).json({ error: 'Invalid token' })
        }
    } catch (error) {
        console.log("error")
        console.log(error.message)
        return response.status(401).json({ error: 'Unauthorised' })
    }


    try {
        const res = await axios.get(`${USER_HOST}/userById`, { headers: { authorization: token } })

        if (res.status !== 200) {
            return response.status(401).json({ error: 'User not found' })
        }
        request.body['user_data'] = res.data[0]

    } catch (error) {
        console.log(error.message)
        return response.status(401).json({ error: 'Unauthorised' })
    }
    next()
}

module.exports = {
    validateUser
}