const axios = require("axios");

const USER_HOST = process.env.USER_HOST ? process.env.USER_HOST : "http://localhost:4000/api/users"
async function validateUser(token) {
  const userRoute = `${USER_HOST}/userById`;
  if (!token) {
    console.log("Missing token");
    return;
  }
  try {
    const response = await axios.get(userRoute, {
      headers: { authorization: token },
    });

    if (response.data === null)
      return null;
    
    return response.data[0].user_id;
  } catch (error) {
    return null
  }
}

module.exports = { validateUser };
