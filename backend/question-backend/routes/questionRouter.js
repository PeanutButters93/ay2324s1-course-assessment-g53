import express from "express";
import { getQuestions } from "../controller/getQuestions.js";
import { addQuestion } from "../controller/addQuestion.js";
import { updateQuestion } from "../controller/updateQuestion.js";
import { deleteQuestion } from "../controller/deleteQuestion.js";
const router = express.Router();
router.get("/", getQuestions);

router.post("/", addQuestion);

router.put("/", updateQuestion);

router.delete("/:id", deleteQuestion);

export default router;
