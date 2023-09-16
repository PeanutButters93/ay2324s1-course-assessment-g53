import { useState, useEffect } from "react";
import "./QuestionForm.css";
import {
  saveQuestionsToLocalStorage,
  getQuestionsFromLocalStorage,
} from "./LocalStorage";

const QuestionForm = (props) => {
  const { questions, setQuestions, COMPLEXITY } = props;

  const [errorMessage, setErrorMessage] = useState("");

  // Use local storage to initialize the questions state
  useEffect(() => {
    const local = getQuestionsFromLocalStorage();
    const storedQuestions = local ? local : questions;
    if (local !== null) {
      setQuestions(local);
    } else {
      setQuestions(questions);
      saveQuestionsToLocalStorage(questions);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title || !description || !category || !complexity) {
      setErrorMessage("Please fill in all fields!");
      return;
    }

    const isDuplicate = questions.some(
      (question) =>
        question.title === title || question.description === description
    );

    if (isDuplicate) {
      setErrorMessage("This question already exists!");
      return;
    }

    const id =
      questions.length > 0 ? questions[questions.length - 1].id + 1 : 1;
    const question = { id, title, description, category, complexity };
    setQuestions([...questions, question]);

    // Save the new questions to local storage
    saveQuestionsToLocalStorage([...questions, question]);
    setTitle("");
    setDescription("");
    setCategory("");
    setComplexity("");
    setErrorMessage("");
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");

  return (
    <form className="QuestionForm" onSubmit={handleSubmit}>
      <h2 className="left-aligned">Question Form</h2>

      <div className="form-group">
        <div className="input-group">
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">Description: </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="category">Category: </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>

        <div className="select-group">
          <label htmlFor="complexity">Complexity: </label>
          <select
            id="complexity"
            value={complexity}
            onChange={(event) => setComplexity(event.target.value)}
          >
            <option value="">--Please choose an option--</option>
            {Object.values(COMPLEXITY).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="button" onClick={handleSubmit}>
          Submit
        </button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </form>
  );
};

export default QuestionForm;
