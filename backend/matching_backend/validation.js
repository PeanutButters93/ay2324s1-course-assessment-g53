import axios from "axios";

async function validateUser(token) {
  const userRoute = "http://localhost:4000/api/users/userById";
  if (!token) {
    console.log("Missing token")
    return;
  }
  const response = await axios.get(userRoute, {
    headers: { authorization: token },
  });
  if (response.data == null) {
    console.log("Invalid token")
    return;
  } else {
    const userId = response.data.user_id;
    return userId;
  }
}

module.exports = { validateUser };
