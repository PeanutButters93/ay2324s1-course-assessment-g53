import { Button, TextField , Box, FormControl, MenuItem} from "@mui/material";
import { useState, useEffect} from "react";
import { Modal , Typography} from "@mui/material";



// const yourFunction = async () => {
//   await new Promise(resolve => setTimeout(resolve, 5000)); 
//   console.log("Waited 5s");
// };
const modal_style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Match = (props) => {
    const [difficulty, setDifficulty] = useState("")
    const [timeLeft, setTimeLeft] = useState(10);
    const [startCount, setStartCount] = useState(false)
    const [open, setOpen] = useState(false)

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
                    setOpen(true)
                    setStartCount(false)
                    setTimeLeft(10)
                }
            }
        } else {
            return;
        }
    }, [startCount, timeLeft])

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(difficulty)
        setStartCount(true)
        
        //Send the request here. yourFunction simulates the sending of the request. 
        //await yourFunction()
    }

    const handleCancel = (event) => {
        event.preventDefault()
        setStartCount(false)
        setTimeLeft(10)
        console.log("Cancelled")
    }

    const handleCloseModal = () => {
        setOpen(false)
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
                
                <Box sx={{height: "100px"}}></Box>
                <Box>Timer Left: {timeLeft}</Box>
        </FormControl>
        {
        <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Oops...
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Sorry we were unable to find you a match
          </Typography>
        </Box>
      </Modal>
        }
        
    </Box>);
}

export default Match;
