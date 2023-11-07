const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
const {getQuestionsHistory} = require("../controller/getUserQuestionHistory")

dotenv.config({
    path: ".env.local"
})

router.get("/questions/:userID", getQuestionsHistory);

module.exports = router;