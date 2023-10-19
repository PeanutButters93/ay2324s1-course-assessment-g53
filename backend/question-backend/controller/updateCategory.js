import Category from "../model/Category.js";
import Question from "../model/Question.js";

export async function updateCategory(req, res) {
    try {
        const _id = req.body._id;
        const categoryToUpdate = await Category.findOne({ _id: _id });
        const updatedName = req.body.name;
        if (updatedName === categoryToUpdate.name) {
            res.send(categoryToUpdate.toJSON());
            return;
        }

        const duplicate = await Category.findOne({ name: updatedName });
        if (duplicate) {
            res.status(400).send("Category name already exists");
            return;
        }


        await Question.updateMany({ categories: 
            { $elemMatch: { name: categoryToUpdate.name } } 
        }, { $set: { "categories.$.name": updatedName }});
        categoryToUpdate.name = updatedName
        await categoryToUpdate.save();

        res.send(categoryToUpdate.toJSON());
        
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR");
    }
}