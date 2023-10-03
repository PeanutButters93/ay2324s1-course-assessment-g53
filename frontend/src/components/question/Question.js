import * as React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import {useSelector } from "react-redux"


export default function Question(props) {
  const questions = props.questions;
  const setAddPage = props.setAddPage;
  const setViewPage = props.setViewPage;
  const setEditPage = props.setEditPage;
  const selectedQuestion = props.selectedQuestion;
  const setSelectedQuestion = props.setSelectedQuestion;
  const deleteQuestion = props.deleteQuestion;
  const is_admin = useSelector((state) => state.auth.is_admin);

  const handleAddClick = () => {
    setAddPage(true);
    setViewPage(false);
    setEditPage(false);
  };

  const handleViewClick = (question) => {
    setAddPage(false);
    setViewPage(true);
    setEditPage(false);
    setSelectedQuestion(question);
  };

  const handleEditClick = (question) => {
    setAddPage(false);
    setViewPage(false);
    setEditPage(true);
    setSelectedQuestion(question);
  };

  const handleDeleteClick = (question) => {
    if (
      window.confirm(
        `Are you sure you want to delete Question ${question.id}? This is an irreversible action!`
      )
    ) {
      if (selectedQuestion === question) {
        setViewPage(false);
        setEditPage(false);
        setSelectedQuestion(null);
      }
      deleteQuestion(question, questions);
    }
  };

  return (
    <React.Fragment>
      <Title>Question Bank</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Question ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Complexity</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.id}</TableCell>
              <TableCell>{question.title}</TableCell>
              <TableCell>{question.categories}</TableCell>
              <TableCell>{question.complexity}</TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    color="primary"
                    aria-label="View"
                    onClick={() => handleViewClick(question)}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  {is_admin && (
                    <>
                      <IconButton
                        color="primary"
                        aria-label="Edit"
                        onClick={() => handleEditClick(question)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        aria-label="Delete"
                        onClick={() => handleDeleteClick(question)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={handleAddClick} sx={{ mt: 3 }}>
        Add A New Question
      </Link>
    </React.Fragment>
  );
}
