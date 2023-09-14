import express from "express";
import Question from "../model/Question.js";
import { getQuestions } from "../controller/getQuestions.js";

const router = express.Router();
router.get("/", getQuestions);

router.get("/questionPage", function (req, res) {
  res.send("You are sending a get request to the question page!");
  console.log("You have reached the question page!");
});

router.post("/questionPage", function (req, res) {
  res.send("You are sending a post request to the question page!");
});

export default router;
