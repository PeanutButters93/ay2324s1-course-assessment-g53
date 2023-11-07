const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
const getQuestionsHistory = require("../controller/getUserQuestionHistory")

dotenv.config({
    path: ".env.local"
})

mongoose.connect(process.env.MONGODB_URI)

router.get("/", getQuestionsHistory);

module.exports = router;