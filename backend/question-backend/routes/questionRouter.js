import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
  res.send("Connected to Question service");
});

router.get("/questionPage", function (req, res) {
  res.send("You are sending a get request to the question page!");
  console.log("You have reached the question page!");
});

router.post("/questionPage", function (req, res) {
  res.send("You are sending a post request to the question page!");
});

export default router;
