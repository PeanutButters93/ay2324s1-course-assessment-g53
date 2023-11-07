import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import useCookie from "../components/useCookie";

const HISTORY_HOST = process.env.REACT_APP_HISTORY_HOST
  ? process.env.REACT_APP_HISTORY_HOST
  : "http://localhost:5000/api/history";

function QuestionHistoryPage() {
  const [data, setData] = useState("welcome to the qsn history page");
  const [history, setHistory] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const { getAuthCookie } = useCookie();

  const token = getAuthCookie();
  const tokenBody = token.split(".")[1];
  let buffer = JSON.parse(atob(tokenBody));
  const user_id = buffer.user_data.user_id;

  useEffect(() => {
    const response = axios
      .get(`${HISTORY_HOST}/questions/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthCookie(),
        },
      })
      .then((response) => {
        if (response.status === 403) {
          // Handle the forbidden error
          return response.then((err) => {
            throw err;
          });
        }
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        return;
      });
  }, [getAuthCookie]);

  return <div>~~ {data} ~~</div>;
}

// const handleOpenModal = (question) => {
//   setSelectedQuestion(question);
//   setIsModalOpen(true);
// };

// const handleCloseModal = () => {
//   setIsModalOpen(false);
// };

// return (
// <div>
//   <Typography>{questions}</Typography>
//   {/* {history.map((question) => (
//     <div key={question._id}>
//       <h2>{question.question_title}</h2>
//       <p>{question.question_description}</p>
//       <p>Categories: {question.categories.join(', ')}</p>
//       <p>Complexity: {question.complexity}</p>
//       <p>Last Attempt: {new Date(question.last_attempt).toLocaleString()}</p>
//       <Button onClick={() => handleOpenModal(question)}>View Attempt</Button>
//     </div>
//   ))}

//   <Modal
//     open={isModalOpen}
//     onClose={handleCloseModal}
//     aria-labelledby="modal-modal-title"
//     aria-describedby="modal-modal-description"
//   >
//     <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
//       <Typography id="modal-modal-title" variant="h6" component="h2">
//         {selectedQuestion?.question_title}
//       </Typography>
//       <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//         {selectedQuestion?.attempt}
//       </Typography>
//     </Box>
//   </Modal> */}
// </div>
// );
// }

export default QuestionHistoryPage;
