import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    categories: [String],
    complexity: String,
});

const Question = mongoose.model("question", questionSchema);
export default Question;
