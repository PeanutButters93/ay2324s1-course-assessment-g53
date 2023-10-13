import express from "express";
import { getQuestions } from "../controller/get_room_id.js";
import { checkLogin } from "../middleware/checkLogin.js";

const router = express.Router();

router.get("/", getQuestions);

export default router;
