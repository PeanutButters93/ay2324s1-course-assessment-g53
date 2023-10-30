import { Button } from "@mui/material"
import useCookie from "./useCookie"

const SaveSolutionButton = ({userCode}) => {
    const { getAuthCookie } = useCookie()

    const handleSubmit = async () => {
        // Get ID
        console.log(getAuthCookie());
        // get Soln
        console.log(userCode)
        // TODO Question
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