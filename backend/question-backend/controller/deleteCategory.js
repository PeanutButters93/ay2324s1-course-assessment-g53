import Category from "../model/Category.js";
import Question from "../model/Question.js";

export async function deleteCategory(req, res) {
    const name = decodeURIComponent(req.params.name);
    console.log(`Deleting ${name} category`);
    try {
        const questions = await Question.find({ categories: 
            { $elemMatch: { name: name } } 
        });
        if (questions) {
            console.log('Category is in use');
            res.status(400).send("Category is in use");
            return;
        }
        await Category.deleteOne({ _id: id });
        res.send("Success");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}