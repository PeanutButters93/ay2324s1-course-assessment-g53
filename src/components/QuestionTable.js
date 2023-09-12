import React from "react";
import "./QuestionTable.css";
import Question from "./Question";

const QuestionTable = (props) => {
  const questions = props.questions;
  return (
    <table>
      <tbody>
        <tr>
          <th>Question ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Category</th>
          <th>Complexity</th>
        </tr>

        {questions.map((qn) => (
          <tr>
            <Question key={qn.id} question_data={qn} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuestionTable;
