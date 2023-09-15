import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Title from './Title';
import { useState, useEffect } from 'react';

const EditQuestion = (props) => {
    const question = props.question;
    const COMPLEXITY = props.COMPLEXITY;
    const setViewPage = props.setViewPage;
    const setEditPage = props.setEditPage;
    const checkForDuplicates = props.checkForDuplicates;
    const [title, setTitle] = useState(question.title);
    const [categories, setCategories] = useState(question.categories);
    const [complexity, setComplexity] = useState(question.complexity);
    const [description, setDescription] = useState(question.description);

    // Use useEffect to update state when the question prop changes
    useEffect(() => {
        setTitle(question.title);
        setCategories(question.categories);
        setComplexity(question.complexity);
        setDescription(question.description);
    }, [question]);

    const handleUpdate = () => {
        console.log("handleUpdate");
        question.title = title;
        question.categories = categories;
        question.complexity = complexity;
        question.description = description;
        setEditPage(false);
        setViewPage(true);
    };
    console.log(question);

    return (
        <div>
            <Title>Edit Question</Title>
            <TextField 
              fullWidth 
              label={'Title'} 
              id="Title" 
              margin="normal" 
              value = {title} 
              onChange={event => setTitle(event.target.value)}
            />
            <TextField 
              fullWidth 
              label={'Categories'} 
              id="Categories" 
              margin="normal" 
              value={categories} 
              onChange={event => setCategories(event.target.value)}/>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="complexity">Complexity</InputLabel>
                <Select
                    labelId="complexity"
                    id="complexity"
                    value={complexity}
                    label="Complexity"
                    onChange={event => setComplexity(event.target.value)}
                >
                    <MenuItem value={COMPLEXITY.EASY}>EASY</MenuItem>
                    <MenuItem value={COMPLEXITY.MEDIUM}>MEDIUM</MenuItem>
                    <MenuItem value={COMPLEXITY.HARD}>HARD</MenuItem>
                </Select>
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
                />
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleUpdate}
            >Update</Button>
        </div>
    )
};

export default EditQuestion;