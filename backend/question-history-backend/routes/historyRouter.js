const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")

dotenv.config({
    path: ".env.local"
})

router.get("/", getQuestions);
router.post("/", async (req, res) => {
    res.send({ document : "Hello from the BE~!"})
})

module.exports = router;