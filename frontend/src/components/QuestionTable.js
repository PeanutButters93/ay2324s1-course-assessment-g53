import React from "react";
import "./QuestionTable.css";
import Question from "./Question";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getQuestionsFromLocalStorage, saveQuestionsToLocalStorage } from "../LocalStorage";


const QuestionTable = (props) => {
  const { questions, setQuestions } = props;

  const handleDelete = (questionId) => {
    const updatedQuestions = questions.filter(qn => qn.id !== questionId)
    setQuestions(updatedQuestions);
    saveQuestionsToLocalStorage(updatedQuestions);
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Complexity</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((qn) => (
            <tr key={qn.id}>
              <Question question_data={qn} />
              <button className="delete-button" onClick={() => handleDelete(qn.id)}>x</button>
            </tr>
          ))}
        </tbody>
      </table>
      <Table>
        <TableHead>
            <TableRow>
                <TableCell>Question ID</TableCell>
                <TableCell>Title</TableCell>  
                <TableCell>Category</TableCell>
                <TableCell>Complexity</TableCell>
            </TableRow>
        </TableHead>
      </Table>
    </>
  );
};

export default QuestionTable;
