import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useCookie from "../useCookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import useTheme from "@mui/material/styles/useTheme";

const CATEGORIES_HOST = process.env.REACT_APP_CATEGORIES_HOST ? process.env.REACT_APP_CATEGORIES_HOST : "http://localhost:8000/api/categories";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(category, categories, theme) {
    return {
        fontWeight:
        categories.indexOf(category) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

export default function Question(props) {
    const questions = props.questions;
    const setAddPage = props.setAddPage;
    const setViewPage = props.setViewPage;
    const setEditPage = props.setEditPage;
    const setCategoriesPage = props.setCategoriesPage;
    const selectedQuestion = props.selectedQuestion;
    const setSelectedQuestion = props.setSelectedQuestion;
    const filteredQuestions = props.filteredQuestions;
    const setFilteredQuestions = props.setFilteredQuestions;
    const deleteQuestion = props.deleteQuestion;
    const buttonClickCount = props.buttonClickCount;
    const is_admin = useSelector((state) => state.auth.is_admin);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const { getAuthCookie } = useCookie();
    const theme = useTheme();

    useEffect(() => {
        async function fetchCategories() {
            const response = await axios.get(CATEGORIES_HOST, {
                headers: {
                    'Authorization': getAuthCookie()
                }
            })
            const data = response.data;
            const categories = [];
            for (var i of data) {
                categories.push(i.name);
            }
            setCategoriesList(categories);
        }
        fetchCategories()
    }, [buttonClickCount]);

    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredQuestions(questions);
            return;
        }
        setFilteredQuestions(questions.filter(question => question.categories.some(category => selectedCategories.includes(category))));
    }, [questions, selectedCategories]);

    const handleAddClick = () => {
        setAddPage(true);
        setViewPage(false);
        setEditPage(false);
        setCategoriesPage(false);
    };

    const handleViewClick = (question) => {
        setAddPage(false);
        setViewPage(true);
        setEditPage(false);
        setCategoriesPage(false);
        setSelectedQuestion(question);
    };

    const handleEditClick = (question) => {
        setAddPage(false);
        setViewPage(false);
        setEditPage(true);
        setCategoriesPage(false);
        setSelectedQuestion(question);
    };

    const handleCategoriesClick = () => {
        setAddPage(false);
        setViewPage(false);
        setEditPage(false);
        setCategoriesPage(true);
        setSelectedQuestion(null); // TODO: is this necessary?
    };

    const handleDeleteClick = (question) => {
        if (window.confirm(`Are you sure you want to delete Question ${question.id}? This is an irreversible action!`)) {
            if (selectedQuestion === question) {
                setViewPage(false);
                setEditPage(false);
                setSelectedQuestion(null);
            }
            deleteQuestion(question, questions);
        }
    };

    const handleChange = (event) => {
        const { target: { value } } = event;
        setSelectedCategories(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <React.Fragment>
        <Title>Question Bank</Title>
        <FormControl sx={{ width: 535 }}>
            <InputLabel id="Search by category">Search by category</InputLabel>
            <Select
                labelId="categories-label"
                id="categories"
                multiple
                value={selectedCategories}
                onChange={handleChange}
                input={<OutlinedInput id="select-categories" label="Search by category" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={value} />
                    ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {categoriesList.map((category) => (
                    <MenuItem
                    key={category}
                    value={category}
                    style={getStyles(category, selectedCategories, theme)}
                    >
                        {category}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Table size="small">
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Complexity</TableCell>
                <TableCell align="right"></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                    <TableCell>{question.id}</TableCell>
                    <TableCell>{question.title}</TableCell>
                    <TableCell>
                        {question.categories.map(category => (
                            <Chip key={category} label={category} style={{ marginRight: '8px', marginBottom: '8px' }} />
                        ))}
                    </TableCell>
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
        {is_admin && (
            <div>
                <Button color="primary" href="#" onClick={handleAddClick} sx={{ mt: 1 }}>
                    Add New Question
                </Button>
                <Button color="primary" href="#" onClick={handleCategoriesClick} sx={{ mt: 1 }}>
                    Edit Categories
                </Button>
            </div>
        )}
        </React.Fragment>
    );
}
