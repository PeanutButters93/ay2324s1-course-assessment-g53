import React from "react";
import "./QuestionTable.css";
import Question from "./Question";

const QuestionTable = (props) => {
  const questions = props.questions;
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Complexity</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((qn) => (
            <tr key={qn.id}>
              <Question question_data={qn} />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default QuestionTable;
