import express from "express";
import { getQuestions } from "../controller/getQuestions.js";
import { addQuestion } from "../controller/addQuestion.js";
import { updateQuestion } from "../controller/updateQuestion.js";
import { deleteQuestion } from "../controller/deleteQuestion.js";
import { checkLogin } from "../middleware/checkLogin.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
const router = express.Router();
router.get("/", [checkLogin], getQuestions);

router.post("/", [checkLogin, checkAdmin], addQuestion);

router.put("/", [checkLogin, checkAdmin], updateQuestion);

router.delete("/:id", [checkLogin, checkAdmin], deleteQuestion);

export default router;
