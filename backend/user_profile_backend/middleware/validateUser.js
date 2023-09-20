const axios = require('axios');
const { verifyJsonWebToken } = require('./tokenUtils');

const user_backend_url = "http://localhost:4000/api/users"

async function validateUser(request, response, next) {
    const token = request.headers.authorization;
    let user_id;

    try {
        user_id = verifyJsonWebToken(token).userId;
    } catch(error) {
        console.log(error.message);
        return response.status(401).json({ error: 'Unauthorised' });
    }

    const userById_url = user_backend_url + "/userById?user_id=" + user_id;

    try {
        const user = await axios.get(userById_url, { headers : { Authorization: token } });
        if (!user) {
            return response.status(401).json({ error: 'Unauthorised' });
        }
    } catch(error) {
        console.log(error.message);
        return response.status(401).json({ error: 'Unauthorised' });
    }

    next();
}

module.exports = {
    validateUser
}