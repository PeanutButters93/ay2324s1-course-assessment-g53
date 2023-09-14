import express from "express";
import Question from "../model/Question.js";
const router = express.Router();

async function getQuestions() {
  try {
    const result = await Question.find();
    console.groupCollapsed(result);
  } catch (error) {
    throw error;
  }
}
router.get("/", function (req, res) {
  try {
    const qns = getQuestions();
  } catch (error) {
    res.status(400).send("Error");
  }
  res.send("Completed GET");
});

router.get("/questionPage", function (req, res) {
  res.send("You are sending a get request to the question page!");
  console.log("You have reached the question page!");
});

router.post("/questionPage", function (req, res) {
  res.send("You are sending a post request to the question page!");
});

export default router;
