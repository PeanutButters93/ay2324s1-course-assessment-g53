import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders(props) {
    const questions = props.questions;
    const setViewPage = props.setViewPage;
    const setEditPage = props.setEditPage;
    const setSelectedQuestion = props.setSelectedQuestion;

    const handleViewClick = (question) => {
        setViewPage(true);
        setEditPage(false);
        setSelectedQuestion(question);
    };

    const handleEditClick = (question) => {
        setViewPage(false);
        setEditPage(true);
        setSelectedQuestion(question);
    }

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
                <TableCell>{question.category}</TableCell>
                <TableCell>{question.complexity}</TableCell>
                <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                        color="primary"
                        aria-label="View"
                        onClick={() => handleViewClick(question)}
                        >
                            <VisibilityIcon />
                        </IconButton>
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
                            // onClick={() => handleActionClick('delete', question.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
            Add a new question
        </Link>
        </React.Fragment>
    );
}
