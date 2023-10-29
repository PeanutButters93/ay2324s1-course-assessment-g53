import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { OutlinedInput } from '@mui/material';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Title from './Title';
import useCookie from '../useCookie';
import { useState, useEffect } from 'react';
import useTheme from '@mui/material/styles/useTheme';

const CATEGORIES_HOST = process.env.REACT_APP_CATEGORIES_HOST ? process.env.REACT_APP_CATEGORIES_HOST : "http://localhost:8000/api/categories";
const cancelMessage = "Are you sure you want to cancel? All changes will be lost.";
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

const EditQuestion = (props) => {
    const question = props.question;
    const COMPLEXITY = props.COMPLEXITY;
    const setViewPage = props.setViewPage;
    const setEditPage = props.setEditPage;
    const checkEmpty = props.checkEmpty;
    const questions = props.questions.filter(x => x.id !== question.id);
    const duplicateCheckers = props.duplicateCheckers;
    const duplicateMessages = props.duplicateMessages;
    const editQuestion = props.editQuestion
    const setSelectedQuestion = props.setSelectedQuestion;

    const [title, setTitle] = useState(question.title);
    const [categories, setCategories] = useState(question.categories);
    const [complexity, setComplexity] = useState(question.complexity);
    const [description, setDescription] = useState(question.description);

    const [emptyTitleMessage, setEmptyTitleMessage] = useState('');
    const [emptyDescriptionMessage, setEmptyDescriptionMessage] = useState('');
    const [emptyCategoryMessage, setEmptyCategoryMessage] = useState([]);
    const [emptyComplexityMessage, setEmptyComplexityMessage] = useState('');

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

    // Use useEffect to update state when the question prop changes
    useEffect(() => {
        setTitle(question.title);
        setCategories(question.categories);
        setComplexity(question.complexity);
        setDescription(question.description);
        setEmptyTitleMessage("");
        setEmptyDescriptionMessage("");
        setEmptyCategoryMessage("");
        setEmptyComplexityMessage("");
    }, [question]);

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

    const handleUpdate = async () => {
        checkEmpty(title, setEmptyTitleMessage, description, setEmptyDescriptionMessage, categories, setEmptyCategoryMessage, complexity, setEmptyComplexityMessage);

        if (!title || !description || !categories || !complexity) {
            return;
        }

        if (hasDuplicateTitle || hasDuplicateDescription) {
            return;
        }

        const editedQuestion = await editQuestion(question, title, description, categories, complexity, questions)
        setSelectedQuestion(editedQuestion);
        setEditPage(false);
        setViewPage(true);
    };

    const handleCancel = () => {
        if (window.confirm(cancelMessage)) {
            setEditPage(false);
            setViewPage(true);
        }
    }

    const duplicateTitleMessage = hasDuplicateTitle ? duplicateMessages.title : "";
    const duplicateDescriptionMessage = hasDuplicateDescription ? duplicateMessages.description : ""; 
    return (
        <div>
            <Title>Edit Question {question.id}</Title>
            <TextField 
              fullWidth
              label={'Title'} 
              id="Title" 
              margin="normal" 
              value = {title} 
              onChange={event => setTitle(event.target.value)}
              error = {!!emptyTitleMessage || !!duplicateTitleMessage}
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
                    input={<OutlinedInput id="select-categories" label="Categories" />}
                    error={!!emptyCategoryMessage}
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
                <InputLabel id="complexity" error={!!emptyComplexityMessage}>Complexity</InputLabel>
                <Select
                    labelId="complexity"
                    id="complexity"
                    value={complexity}
                    label="Complexity"
                    onChange={event => setComplexity(event.target.value)}
                    error={!!emptyComplexityMessage}
                >
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
                onChange={event => setDescription(event.target.value)}
                error={!!emptyDescriptionMessage || !!duplicateDescriptionMessage}
                helperText={emptyDescriptionMessage || duplicateDescriptionMessage}
                />
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 , marginRight:2 }}
                onClick={handleUpdate}
            >Update Question</Button>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleCancel}
            >Cancel</Button>
        </div>
    )
};

export default EditQuestion;