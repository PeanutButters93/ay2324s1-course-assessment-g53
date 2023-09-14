import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";

import QuestionRouter from "./routes/questionRouter.js";
dotenv.config({
  path: "../.env.local",
});

const app = express();
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

app.use("/api", QuestionRouter);
app.listen(8000, () => {
  console.log("Question service connected on port 8000");
});
