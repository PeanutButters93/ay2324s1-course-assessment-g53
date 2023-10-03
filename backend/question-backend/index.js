import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import QuestionRouter from "./routes/questionRouter.js";
import cors from "cors";

dotenv.config({
  path: "./.env.local",
});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

app.use("/api/questions", QuestionRouter);
app.listen(8000, () => {
  console.log("Question service connected on port 8000");
});
