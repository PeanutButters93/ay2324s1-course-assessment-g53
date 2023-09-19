import Question from "../model/Question.js";

export async function deleteQuestion(req, res) {
    try {
      await Question.deleteOne({id: req.body.id})
      res.send("Success");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }