import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import Question from "./model/Question.js";
import QuestionRouter from "./routes/questionRouter.js";
dotenv.config({
  path: "/Users/zzthian/Desktop/proj_CS3219/ay2324s1-course-assessment-g53/backend/.env.local",
});

const app = express();
const uri = process.env.MONGODB_URI;
// mongoose.connect(uri);
// console.log(uri);

app.use("/", QuestionRouter);
app.listen(8000, () => {
  console.log("Question service connected on port 8000");
});
