import Category from "../model/Category.js";

export async function addCategory(req, res) {
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(req.body.name, 'i') } });
    if (existingCategory) {
        res.status(400).send("Category already exists");
        return;
    }
    try {
        const category = new Category({
            name: req.body.name,
        });
        await category.save();
        res.send("Success");
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR");
    }
}