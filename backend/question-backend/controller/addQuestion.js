import Question from "../model/Question.js"
export async function addQuestion (req, res) {
  const existingTitle = await Question.findOne({ title: req.body.title })
  if (existingTitle) {
    res.status(400).send("A Question with given title already exists")
    return
  }
  try {
    console.log(req.body)

    const question = new Question({
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      categories: req.body.categories,
      complexity: req.body.complexity,
    })
    await question.save();
    res.send("Success")
  } catch (error) {
    console.log(error)
    res.status(400).send("ERROR")
  }
}
