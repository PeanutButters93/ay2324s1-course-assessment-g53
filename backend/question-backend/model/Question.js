import mongoose from "mongoose";
import categorySchema from "./Categories.js";

const questionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  desc: String,
  categories: [categorySchema],
  complexity: String,
});

const Question = mongoose.model("question", questionSchema);
export default Question;
