import { Button, Select , Box, FormControl, InputLabel, MenuItem} from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { useState } from "react";


const Match = (props) => {
    const [difficulty, setDifficulty] = useState("")

    const handleDifficultyChange = (event) => {
        event.preventDefault()
        setDifficulty(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(difficulty)
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
        </FormControl>
        
    </Box>);
}

export default Match;
