import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Title from "./Title";
import { useState } from "react";

const Categories = (props) => {
    const setCategoriesPage = props.setCategoriesPage;
    const buttonClickCount = props.buttonClickCount;
    const setButtonClickCount = props.setButtonClickCount;

    const [editExistingCategory, setEditExistingCategory] = useState(true);
    const [addNewCategory, setAddNewCategory] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);

    return (
        <div>
            <Title>Categories</Title>
            { editExistingCategory && (
                    <EditCategory
                        setCategoriesPage={setCategoriesPage}
                        setAddNewCategory={setAddNewCategory}
                        setEditExistingCategory={setEditExistingCategory}
                        buttonClickCount={buttonClickCount}
                        setButtonClickCount={setButtonClickCount}
                    />
            )}
            { addNewCategory && (
                    <AddCategory
                        setCategoriesPage={setCategoriesPage}
                        setAddNewCategory={setAddNewCategory}
                        setEditExistingCategory={setEditExistingCategory}
                        buttonClickCount={buttonClickCount}
                        setButtonClickCount={setButtonClickCount}
                    />
            )}
        </div>
    )
};

export default Categories;