import axios from "axios";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import useCookie from "../useCookie";
import { useEffect, useState } from "react";
import Title from "./Title";

const QUESTION_HOST = process.env.REACT_APP_QUESTION_HOST ? process.env.REACT_APP_QUESTION_HOST : "http://localhost:8000/api/questions";
const CATEGORIES_HOST = process.env.REACT_APP_CATEGORIES_HOST ? process.env.REACT_APP_CATEGORIES_HOST : "http://localhost:8000/api/categories";

const categoryHelperText = "Please select a category to edit it";

const EditCategory = (props) => {
    const setCategoriesPage = props.setCategoriesPage;
    const setAddNewCategory = props.setAddNewCategory;
    const setEditExistingCategory = props.setEditExistingCategory;
    const buttonClickCount = props.buttonClickCount;
    const setButtonClickCount = props.setButtonClickCount;
    
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [updatedCategory, setUpdatedCategory] = useState("");
    const [emptyCategoryMessage, setEmptyCategoryMessage] = useState("");
    const [duplicateCategoryMessage, setDuplicateCategoryMessage] = useState("");

    const { getAuthCookie } = useCookie();

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
    }, [buttonClickCount])

    const handleAdd = () => {
        setAddNewCategory(true);
        setEditExistingCategory(false);
    };

    const handleUpdate = async () => {
        if (updatedCategory === "") {
            setEmptyCategoryMessage("Please select a category");
            return;
        }

        if (updatedCategory !== selectedCategory && categoriesList.indexOf(updatedCategory) !== -1) {
            setDuplicateCategoryMessage("Category already exists");
            return;
        }

        const oldNameUri = "/" + encodeURIComponent(selectedCategory);
        const updatedCategoryJson = { name: updatedCategory };

        await axios.put(CATEGORIES_HOST + oldNameUri, updatedCategoryJson, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthCookie()
            }})
            .catch(error => {
                console.error('Error:', error);
                return;
            });
        
        setEmptyCategoryMessage("");
        setDuplicateCategoryMessage("");
        setSelectedCategory("");
        setButtonClickCount(buttonClickCount + 1);
        setAddNewCategory(false);
    };

    const handleDelete = async () => {
        const response = await axios.get(QUESTION_HOST, {
            headers: {
                'Authorization': getAuthCookie()
            }
        });

        const data = response.data;
        const questions = [];
        for (var i of data) {
            questions.push(i);
        }

        const questionsWithCategory = questions.filter(question => question.categories.indexOf(selectedCategory) !== -1);
        if (questionsWithCategory.length !== 0) {
            const questionsWithCategoryNotAsOnlyCategory = questionsWithCategory.filter(question => question.categories.length > 1);
            const questionsWithCategoryAsOnlyCategory = questionsWithCategory.filter(question => question.categories.length === 1);

            for (var question of questionsWithCategoryNotAsOnlyCategory) {
                const updatedQuestionCategories = question.categories.filter(category => category !== selectedCategory);
                question.categories = updatedQuestionCategories;
                await axios.put(QUESTION_HOST, question, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getAuthCookie()
                    }})
                    .catch(error => {
                        console.error('Error:', error);
                        return;
                    });
            }

            if (questionsWithCategoryAsOnlyCategory.length > 0) {
                var listOfQuestions = "";
                for (var question of questionsWithCategoryAsOnlyCategory) {
                    listOfQuestions += question.id + ") " + question.title + "\n";
                }
                alert(`Category has not been fully deleted.\n\nThe following questions have ${selectedCategory} as their only category:\n${listOfQuestions}\nPlease delete these questions or add another category to them before deleting the ${selectedCategory} category.`);
                setButtonClickCount(buttonClickCount + 1);
                return;
            }
        }

        await axios.delete(CATEGORIES_HOST + "/" + encodeURIComponent(selectedCategory), {
            headers: {
                'Authorization': getAuthCookie()
            }})
            .catch(error => {
                console.error('Error:', error);
                return;
            });
        
        setButtonClickCount(buttonClickCount + 1);
        setSelectedCategory("");
        setAddNewCategory(false);
    };

    const handleCancel = () => {
        setEditExistingCategory(false);
        setAddNewCategory(false);
        setCategoriesPage(false);
    };

    return (
        <div>
            <Title>Edit Existing Category</Title>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="categories">Category</InputLabel>
                <Select
                    labelId="category"
                    id="category"
                    value={selectedCategory}
                    label="Category"
                    onChange={event => {
                        setSelectedCategory(event.target.value);
                        setUpdatedCategory(event.target.value);
                    }}
                >
                    {categoriesList.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                </Select>
                <FormHelperText>{ emptyCategoryMessage || categoryHelperText }</FormHelperText>
                {selectedCategory && (
                    <div>
                        <TextField 
                            fullWidth 
                            label={'Categories'} 
                            id="Categories" 
                            margin="normal" 
                            value={updatedCategory} 
                            onChange={event => setUpdatedCategory(event.target.value)}
                            error={!!emptyCategoryMessage || !!duplicateCategoryMessage}
                            helperText={emptyCategoryMessage || duplicateCategoryMessage}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2 , marginRight:2 }}
                            onClick={handleUpdate}
                        >Update Category</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2 , marginRight:2 }}
                            onClick={handleDelete}
                        >Delete Category</Button>
                    </div>
                )}
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 , marginRight:2 }}
                        onClick={handleAdd}
                    >Add New Category</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={handleCancel}
                    >Cancel</Button>
                </div>
            </FormControl>
        </div>
    )
};

export default EditCategory;