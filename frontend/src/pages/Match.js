import { Button, TextField, Box, FormControl, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { Modal, Typography } from "@mui/material";
import { io } from "socket.io-client";
import useCookie from "../components/useCookie";
import { useNavigate } from "react-router-dom";

// const yourFunction = async () => {
//   await new Promise(resolve => setTimeout(resolve, 5000));
//   console.log("Waited 5s");
// };
const modal_style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const TIME_LIMIT = 15
const MATCHING_HOST = process.env.REACT_APP_MATCHING_HOST ? process.env.REACT_APP_MATCHING_HOST : "ws://localhost:3001"
const Match = (props) => {
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [startCount, setStartCount] = useState(false);
  const [open, setOpen] = useState(false);
  const [matchSocket, setMatchSocket] = useState(null);
  const { getAuthCookie } = useCookie(); 
  const [matchFound, setMatchFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleDifficultyChange = (event) => {
    event.preventDefault();
    setDifficulty(event.target.value);
  };

  function createServer() {
    
    if (matchSocket !== null) return;

    const submitDifficulty = difficulty
    const token = getAuthCookie()
    const socket = io( MATCHING_HOST, {
      reconnection: false,
      auth: {
        token
      },
      query: {
        "difficulty": submitDifficulty,
      },
    })

    const timeout = setTimeout(() => {
      socket.disconnect()
      setIsSubmitting(false)
    }, TIME_LIMIT * 1000)

    socket.on('hello', (data) => {
      console.log('Hello:', data)
      if (!data.room_id) return
      setMatchFound(true)
      setOpen(true)
      setTimeLeft(TIME_LIMIT)
      setStartCount(false)
      setIsSubmitting(false)
      setTimeout(() => {
        navigate(`/room/${data["room_id"]}?difficulty=${difficulty}`);
        }, 2000);
    })

    socket.on('disconnect', () => {
      clearTimeout(timeout)
      console.log('Socket closing')
      setMatchSocket(null)
      setIsSubmitting(false)
    })
    setIsSubmitting(true)
    setMatchSocket(socket)
  }

  useEffect(() => {
    if (startCount) {
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => {
        clearInterval(intervalId);
        if (timeLeft <= 0) {
          setOpen(true);
          setMatchFound(false);
          setStartCount(false);
          setTimeLeft(TIME_LIMIT);
          setIsSubmitting(false);
        }
      };
    } else {
      return;
    }
  }, [startCount, timeLeft]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(difficulty);
    setStartCount(true);
    setIsSubmitting(true)
    createServer();

    //Send the request here. yourFunction simulates the sending of the request.
    //await yourFunction()
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setStartCount(false);
    setIsSubmitting(false)
    setTimeLeft(TIME_LIMIT);
    if (matchSocket) {
      matchSocket.disconnect()
      setMatchSocket(null)
    }
    console.log("Cancelled");
  };

  const handleCloseModal = () => {
    setOpen(false);
    setMatchFound(false)
  };


  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FormControl sx={{ width: "100%", margin: "50px", alignItems: "center" }}>
        <TextField
          select
          id="difficulty"
          label="Difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          sx={{ width: "200px" }}
        >
          <MenuItem key={1} value={"EASY"}>
            EASY
          </MenuItem>
          <MenuItem key={2} value={"MEDIUM"}>
            MEDIUM
          </MenuItem>
          <MenuItem key={3} value={"HARD"}>
            HARD
          </MenuItem>
        </TextField>
        <Box sx={{ height: "200px" }}></Box>
        <Box sx={{ display: "flex" }}>
          <Button
            disabled={isSubmitting}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ width: "150px", height: "50px", margin: "30px" }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: "150px", height: "50px", margin: "30px" }}
          >
            Cancel
          </Button>
        </Box>

        <Box sx={{ height: "100px" }}></Box>
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
              {matchFound ?  "Hooray" :`Oops...` }
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {matchFound ? "Found you a match! Will connect you guys shortly...": "Sorry we were unable to find you a match"}
            </Typography>
          </Box>
        </Modal>
      }
    </Box>
  );
};

export default Match;
