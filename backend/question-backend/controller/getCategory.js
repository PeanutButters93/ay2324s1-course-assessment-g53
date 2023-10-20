import Category from "../model/Category.js";

export async function getCategory(req, res) {
    try {
        const name = decodeURIComponent(req.params.name);
        const category = await Category.findOne({ name: name });
        res.send(category);
    } catch (error) {
        console.log(error);
        res.status(400).send("Error getting category");
    }
}