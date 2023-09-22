import axios from 'axios';

export async function checkAdmin(req, res, next) { 
    const userRoute = "http://localhost:4000/api/users/checkUserAdmin";
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(400).send("You do not posess login token. Please sign in again")
        }
        const response = await axios.get(userRoute, {headers :{authorization : token}});
        if (response.data == null) {
            return res.status(400).send("Token not recognised. Please login again")
        }
        if (response.data.is_admin) {
            next();
        } else {
            return res.status(400).send("You are not an admin, you do not have access to this resource")
        }
        
        
    } catch (error) {
        res.status(400).send(error)
    }
}