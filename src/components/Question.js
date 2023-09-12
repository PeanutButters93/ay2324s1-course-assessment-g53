import React from "react";

const Question = (question_data) => {
  console.log(question_data);
  return (
    <>
      <td>{question_data.id}</td>
      <td>{question_data.title}</td>
      <td>{question_data.description}</td>
      <td>{question_data.category}</td>
      <td>{question_data.complexity}</td>
    </>
  );
};

export default Question;
