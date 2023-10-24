import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import QuestionRouter from "./routes/questionRouter.js";
import cors from "cors";

dotenv.config({
  path: ".env.local",
});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;
const port = process.env.PORT;
mongoose.connect(uri);


app.use("/api/questions", QuestionRouter);
app.use("/", (req, res) => res.status(200).json({status: "OK"}))
app.listen(port, () => {
  console.log(`Question service connected on port ${port}`);
  console.log(process.env.USER_HOST)
});
