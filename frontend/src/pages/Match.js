import { Button, Select , Box, FormControl, InputLabel, MenuItem} from "@mui/material";
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

    return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
        <FormControl sx={{ width: "150px" , margin: "50px"}}>
            <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                <Select 
                label="difficulty"
                id="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
                autoWidth>
                    <MenuItem value={"EASY"}>EASY</MenuItem>
                    <MenuItem value={"MEDIUM"}>MEDIUM</MenuItem>
                    <MenuItem value={"HARD"}>HARD</MenuItem>
                </Select>
                <Box sx={{height: "200px"}}></Box>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{width: "150px", height:"50px"}}>
                Submit
                </Button>
                <Box sx={{height: "200px"}}></Box>
                <Box>Timer Left: {timeLeft}</Box>
        </FormControl>
    </Box>);
}

export default Match;
