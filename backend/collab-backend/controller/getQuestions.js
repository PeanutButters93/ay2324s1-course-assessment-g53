import Question from "../model/Question.js";

export async function getQuestions(req, res) {
  try {
    const questions = await Question.find();
    res.send(questions);
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR");
  }
}
