import Question from "../model/Question.js";

export async function deleteQuestion(req, res) {
    const id = req.params.id
    console.log(id)
    try {
      await Question.deleteOne({id: id})
      res.send("Success");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }