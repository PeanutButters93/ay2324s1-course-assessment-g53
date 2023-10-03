const axios = require("axios");

async function validateUser(token) {
  const userRoute = "http://localhost:4000/api/users/userById";
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
