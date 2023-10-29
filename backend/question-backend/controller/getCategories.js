import Category from "../model/Category.js";

export async function getCategories(req, res) {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (error) {
        console.log(error);
        res.status(400).send("Error getting categories");
    }
}