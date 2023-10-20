import mongoose from "mongoose";
import Category from "./Category.js";

const questionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    desc: String,
    categories: String,
    categories: [String],
    complexity: String,
});

const Question = mongoose.model("question", questionSchema);
export default Question;
