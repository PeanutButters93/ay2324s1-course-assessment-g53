import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import QuestionRouter from "./routes/questionRouter.js";
import cors from "cors";
import CategoryRouter from "./routes/categoryRouter.js";

dotenv.config({
  path: ".env.local",
});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;
const port = process.env.PORT ? process.env.PORT : 8000;
mongoose.connect(uri);


app.use("/api/questions", QuestionRouter);
app.use("/api/categories", CategoryRouter);
app.use("/", (req, res) => res.status(200).json({status: "OK"})) // health check, to see if can be removed
app.listen(port, () => {
  console.log(`Question service connected on port ${port}`);
  console.log(process.env.USER_HOST)
});
