import Category from "../model/Category.js";
import Question from "../model/Question.js";
import mongoose from "mongoose";

export async function deleteCategory(req, res) {
    const id = new mongoose.Types.ObjectId(req.params.id);
    console.log(`Deleting category ${id}`);
    try {
        const questions = await Question.find({ categories: 
            { $elemMatch: { _id: id } } 
        });
        if (questions) {
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