import { Button, TextField , Box, FormControl, MenuItem} from "@mui/material";
import { useState, useEffect} from "react";



const Match = (props) => {
    const [difficulty, setDifficulty] = useState("")
    const [timeLeft, setTimeLeft] = useState(30);
    const [startCount, setStartCount] = useState(false)

    const handleDifficultyChange = (event) => {
        event.preventDefault()
        setDifficulty(event.target.value)
    }

    useEffect(() => {
        if (startCount) {
            const intervalId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000)
            return () => {
                clearInterval(intervalId)
                if (timeLeft <= 0){
                    setStartCount(false)
                    setTimeLeft(30)
                }
            }
        } else {
            return;
        }
    }, [startCount, timeLeft])

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(difficulty)
        setStartCount(true)
        console.log("BYEE")
    }

    const handleCancel = (event) => {
        event.preventDefault()
        setStartCount(false)
        setTimeLeft(30)
        console.log("Cancelled")
    }

    return (
    <Box sx={{ display: "flex", alignItems:"center"}}>
        
        <FormControl sx={{width: "100%" , margin: "50px", alignItems: "center"}}>
        
                <TextField 
                select
                id="difficulty"
                label="Difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
                sx={{width:"200px"}}>
                    <MenuItem key={1} value={"EASY"}>EASY</MenuItem>
                    <MenuItem key={2} value={"MEDIUM"}>MEDIUM</MenuItem>
                    <MenuItem key={3} value={"HARD"}>HARD</MenuItem>
                </TextField>
                <Box sx={{height: "200px"}}></Box>
                <Box sx={{display: "flex"}}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{width: "150px", height:"50px", margin:"30px"}}>
                    Submit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel} sx={{width: "150px", height:"50px", margin:"30px"}}>
                    Cancel
                    </Button>
                </Box>
                
                <Box sx={{height: "200px"}}></Box>
                <Box>Timer Left: {timeLeft}</Box>
        </FormControl>
        
    </Box>);
}

export default Match;
