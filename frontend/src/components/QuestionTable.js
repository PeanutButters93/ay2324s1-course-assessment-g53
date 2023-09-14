import React from "react";
import "./QuestionTable.css";
import Question from "./Question";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const QuestionTable = (props) => {
  const questions = props.questions;
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
