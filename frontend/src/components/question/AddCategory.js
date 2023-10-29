import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Title from './Title';
import useCookie from '../useCookie';
import { useState } from 'react';

const CATEGORIES_HOST = process.env.REACT_APP_CATEGORIES_HOST ? process.env.REACT_APP_CATEGORIES_HOST : "http://localhost:8000/api/categories";

const AddCategory = (props) => {
    const setCategoriesPage = props.setCategoriesPage;
    const setAddNewCategory = props.setAddNewCategory;
    const setEditExistingCategory = props.setEditExistingCategory;
    const buttonClickCount = props.buttonClickCount;
    const setButtonClickCount = props.setButtonClickCount;

    const { getAuthCookie } = useCookie();

    const [newCategory, setNewCategory] = useState("");
    const [emptyCategoryMessage, setEmptyCategoryMessage] = useState("");
    const [duplicateCategoryMessage, setDuplicateCategoryMessage] = useState("");

    const handleSubmit = async () => {
        if (newCategory) {
            setEmptyCategoryMessage("");
        } else {
            setEmptyCategoryMessage("Please enter a category");
            return;
        }

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

        if (categories.indexOf(newCategory) === -1) {
            setDuplicateCategoryMessage("");
        } else {
            setDuplicateCategoryMessage("Category already exists");
            return;
        }

        await axios.post(CATEGORIES_HOST, { name: newCategory }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthCookie()
            }
        })

        setEditExistingCategory(true);
        setAddNewCategory(false);
    }

    const handleCancel = () => {
        setAddNewCategory(false);
        setEditExistingCategory(false);
        setCategoriesPage(false);
    }

    const handleEdit = () => {
        setAddNewCategory(false);
        setEditExistingCategory(true);
    }

    return (
        <div>
            <Title>Add New Category</Title>
            <TextField 
                fullWidth 
                label={'Categories'} 
                id="Categories" 
                margin="normal" 
                onChange={event => setNewCategory(event.target.value)}
                error={!!emptyCategoryMessage || !!duplicateCategoryMessage}
                helperText={emptyCategoryMessage || duplicateCategoryMessage}
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 , marginRight:2 }}
                onClick={handleSubmit}
            >Submit</Button>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 , marginRight:2 }}
                onClick={handleCancel}
            >Cancel</Button>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleEdit}
            >Edit Existing Category</Button>
        </div>
    )
}

export default AddCategory;