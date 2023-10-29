import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { OutlinedInput } from "@mui/material";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useTheme } from '@mui/material/styles';
import Title from "./Title";
import useCookie from "../useCookie";
import { useEffect, useState } from "react";

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

const AddQuestion = (props) => {
    const COMPLEXITY = props.COMPLEXITY;
    const setAddPage = props.setAddPage;
    const setViewPage = props.setViewPage;
    const checkEmpty = props.checkEmpty;
    const addQuestion = props.addQuestion;
    const selectedQuestion = props.selectedQuestion;
    const setSelectedQuestion = props.setSelectedQuestion;
    const duplicateCheckers = props.duplicateCheckers;
    const questions = props.questions;
    const duplicateMessages = props.duplicateMessages;

    const [title, setTitle] = useState("");
    const [categories, setCategories] = useState([]);
    const [complexity, setComplexity] = useState("");
    const [description, setDescription] = useState("");

    const [emptyTitleMessage, setEmptyTitleMessage] = useState("");
    const [emptyDescriptionMessage, setEmptyDescriptionMessage] = useState("");
    const [emptyCategoryMessage, setEmptyCategoryMessage] = useState("");
    const [emptyComplexityMessage, setEmptyComplexityMessage] = useState("");

    const [hasDuplicateTitle, setHasDuplicateTitle] = useState(false);
    const [hasDuplicateDescription, setHasDuplicateDescription] = useState(false);

    const theme = useTheme();
    const [categoriesList, setCategoriesList] = useState([]);
    const {getAuthCookie} = useCookie();

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
    }, [])

    const handleChange = (event) => {
        const { target: { value } } = event;
        setCategories(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    useEffect(() => {
        setHasDuplicateDescription(
        duplicateCheckers.checkDuplicateDescription(description, questions)
        );
    }, [description, questions, duplicateCheckers]);

    useEffect(() => {
        setHasDuplicateTitle(
        duplicateCheckers.checkDuplicateTitle(title, questions)
        );
    }, [title, questions, duplicateCheckers]);

    const handleAdd = async () => {
        checkEmpty(
        title,
        setEmptyTitleMessage,
        description,
        setEmptyDescriptionMessage,
        categories,
        setEmptyCategoryMessage,
        complexity,
        setEmptyComplexityMessage
        );

        if (!title || !description || categories.length === 0 || !complexity) {
            return;
        }

        if (hasDuplicateDescription || hasDuplicateTitle) {
            return;
        }

        const selectedQuestion = await addQuestion(title, description, categories, complexity, questions);

        setSelectedQuestion(selectedQuestion);
        setAddPage(false);
        setViewPage(true);
    };

    const handleCancel = () => {
        setAddPage(false);
        if (selectedQuestion != null) {
            setViewPage(true);
        }
    };

    const duplicateTitleMessage = hasDuplicateTitle
        ? duplicateMessages.title
        : "";
    const duplicateDescriptionMessage = hasDuplicateDescription
        ? duplicateMessages.description
        : "";

    return (
        <div>
            <Title>Add A New Question</Title>
            <TextField
                fullWidth
                label={"Title"}
                id="Title"
                margin="normal"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                error={!!emptyTitleMessage || !!duplicateTitleMessage}
                helperText={emptyTitleMessage || duplicateTitleMessage}
            />
            <FormControl sx={{ width: 588 }}>
                <InputLabel id="categories" error={!!emptyCategoryMessage}>Categories</InputLabel>
                <Select
                    labelId="categories-label"
                    id="categories"
                    multiple
                    value={categories}
                    onChange={handleChange}
                    error={!!emptyCategoryMessage}
                    input={<OutlinedInput id="select-categories" label="Categories" />}
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
                        style={getStyles(category, categories, theme)}
                        >
                            {category}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText error>{emptyCategoryMessage}</FormHelperText>
            </FormControl>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="complexity" error={!!emptyComplexityMessage}>
                    Complexity
                </InputLabel>
                <Select
                    labelId="complexity"
                    id="complexity"
                    value={complexity}
                    label="Complexity"
                    onChange={(event) => setComplexity(event.target.value)}
                    error={!!emptyComplexityMessage}
                >
                <MenuItem value=""><em>--Please select--</em></MenuItem>
                <MenuItem value={COMPLEXITY.EASY}>EASY</MenuItem>
                <MenuItem value={COMPLEXITY.MEDIUM}>MEDIUM</MenuItem>
                <MenuItem value={COMPLEXITY.HARD}>HARD</MenuItem>
                </Select>
                <FormHelperText error>{emptyComplexityMessage}</FormHelperText>
            </FormControl>
            <TextField
                id="description"
                label={"Description"}
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={{ marginTop: 2 }}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                error={!!emptyDescriptionMessage || !!duplicateDescriptionMessage}
                helperText={emptyDescriptionMessage || duplicateDescriptionMessage}
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2, marginRight: 2 }}
                onClick={handleAdd}
            >
                Add Question
            </Button>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleCancel}
            >
                Cancel
            </Button>
        </div>
    );
};

export default AddQuestion;
