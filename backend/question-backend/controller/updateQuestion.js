import Question from "../model/Question.js";

export async function updateQuestion(req, res) {
  console.log(req.body)
  try {
    const id = req.body.id;
    const question_to_change = await Question.findOne({ id: id });
    console.log(question_to_change)
    const new_title = req.body.title
      ? req.body.title
      : question_to_change.title;
    const new_desc = req.body.desc ? req.body.desc : question_to_change.desc;
    const new_categories = req.body.categories
      ? req.body.categories
      : question_to_change.categories;
    const new_complexity = req.body.complexity
      ? req.body.complexity
      : question_to_change.complexity;
    let duplicate_title = [];
    let duplicate_desc = [];
    if (new_title !== question_to_change.title) {
      duplicate_title = await Question.find({ title: new_title });
    }

    if (new_desc !== question_to_change.desc) {
      duplicate_desc = await Question.find({ desc: new_desc });
    }
    if (duplicate_title.length !== 0 || duplicate_desc.length !== 0) {
      res
        .status(400)
        .send(
          "Duplicate entries were found, please change name and/or description"
        );
      return;
    }

    question_to_change.title = new_title;
    question_to_change.desc = new_desc;
    question_to_change.categories = new_categories;
    question_to_change.complexity = new_complexity;

    await question_to_change.save();
    res.send(question_to_change.toJSON());
    
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR");
  }
}
