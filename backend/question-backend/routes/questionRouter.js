import express from "express";
import Question from "../model/Question.js";
import { getQuestions } from "../controller/getQuestions.js";
import { addQuestion } from "../controller/addQuestion.js";
import { updateQuestion } from "../controller/updateQuestion.js";
const router = express.Router();
router.get("/", getQuestions);

router.post("/", addQuestion);

router.put("/", updateQuestion);

export default router;
