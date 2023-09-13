import React from "react";
import "./Question.css";

//Tooltip Solution adapted from https://www.w3schools.com/css/css_tooltip.asp

const Question = ({ question_data }) => {
  console.log(question_data);
  return (
    <>
      <td>{question_data.id}</td>
      <td class = "tooltip">
        {question_data.title}
        <span class="tooltiptext">{question_data.description}</span>
      </td>
      <td>{question_data.category}</td>
      <td>{question_data.complexity}</td>
    </>
  );
};

export default Question;
