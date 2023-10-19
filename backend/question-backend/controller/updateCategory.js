import Category from "../model/Category.js";

export async function updateCategory(req, res) {
    try {
        const _id = req.body._id;
        const categoryToUpdate = await Category.findOne({ _id: _id });
        const updatedName = req.body.name;
        if (updatedName === categoryToUpdate.name) {
            res.status(400).send("No changes made");
            return;
        }

        const duplicate = await Category.findOne({ name: updatedName });
        if (duplicate) {
            res.status(400).send("Category name already exists");
            return;
        }

        categoryToUpdate.name = updatedName;
        await categoryToUpdate.save();
        res.send(categoryToUpdate.toJSON());
        
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR");
    }
}