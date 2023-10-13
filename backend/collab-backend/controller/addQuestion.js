import Question from "../model/Question.js";
export async function addQuestion(req, res) {
  const existingTitle = await Question.findOne({title: req.body.title})
  if (existingTitle) {
    res.status(400).send("A Question with given title already exists")
    return;
  }
  try {
    
    const question = new Question({
      id: req.body.id,
      title: req.body.title,
      desc: req.body.desc,
      categories: req.body.categories,
      complexity: req.body.complexity,
    });
    await question.save();
    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR");
  }
}
