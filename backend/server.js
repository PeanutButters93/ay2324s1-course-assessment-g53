const express = require("express");
require("dotenv").config({
  path: "/Users/zzthian/Desktop/proj_CS3219/ay2324s1-course-assessment-g53/backend/.env.local",
});
const mongoose = require("mongoose");
const Question = require("./model/Question");
const app = express();

const uri = process.env.MONGODB_URI;

// async function connect() {
//   try {
//     await mongoose.connect(uri);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error(error);
//   }
// }

// connect();

mongoose.connect(uri);

const question = new Question({
  id: 1,
  title: "Threesum",
  desc: "a problem",
  category: "algo",
  complexity: "EASY",
});

question.save();

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
