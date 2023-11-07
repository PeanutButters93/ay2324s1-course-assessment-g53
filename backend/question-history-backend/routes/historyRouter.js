const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
const getQuestionsHistory = require("../controller/getUserQuestionHistory")
const mongoose = require("mongoose");

dotenv.config({
    path: ".env.local"
})

router.get("/questions/:userID", getQuestionsHistory);

module.exports = router;