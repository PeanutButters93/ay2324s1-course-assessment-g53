import { Button } from "@mui/material"
import useCookie from "./useCookie"
import axios from "axios"

const REACT_APP_COLLAB_HOST = process.env.REACT_APP_COLLAB_HOST ? process.env.REACT_APP_COLLAB_HOST : "http://localhost:9000/api/collab"

const SaveSolutionButton = ({userCode}) => {
    const { getAuthCookie } = useCookie()

    const handleSubmit = async () => {
        // Get ID
        console.log(getAuthCookie());
        // get Soln
        console.log(userCode)
        // TODO Question

        return axios.post(REACT_APP_COLLAB_HOST + "/save_solution", {
            user_cookie: getAuthCookie(),
        }, {
            headers: {
            "Content-Type": "application/json",
            }
        })
            .catch(error => {
            console.error('Error:', error)
            throw error
        })
    }

    return <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ width: "150px", height: "50px", margin: "30px" }} >
        Save
    </Button>
}

export default SaveSolutionButton