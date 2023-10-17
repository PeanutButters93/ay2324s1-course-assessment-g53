import mongoose from "mongoose";
import categorySchema from "./Category.js";

const questionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  desc: String,
  categories: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
  complexity: String,
});

const Question = mongoose.model("question", questionSchema);
export default Question;
