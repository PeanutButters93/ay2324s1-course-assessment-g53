import { useState } from "react";
import "./QuestionPage.css";
import QuestionForm from "../QuestionForm";

const COMPLEXITY = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};

const DEFAULT_QNS = [
  {
    id: 1,
    title: "Reverse a String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    category: "Strings, Algorithms",
    complexity: COMPLEXITY.EASY,
  },
  {
    id: 2,
    title: "Linked List Cycle Detection",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter. Return true if there is a cycle in the linked list. Otherwise, return false.",
    category: "Data Structures, Algorithms",
    complexity: COMPLEXITY.EASY,
  },
];

function QuestionPage() {
  const [questions, setQuestions] = useState(DEFAULT_QNS);

  return (
    <div className="App">
      <header>
        <h1>Welcome to PeerPrep</h1>
      </header>
      <div className="content">
        <h2>
          Here are some questions you can practice! Feel free to add more :)
        </h2>
        <table>
          <tr>
            <th>Question ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Complexity</th>
          </tr>
          {questions.map((x) => (
            <tr>
              <th>{x.id}</th>
              <th>{x.title}</th>
              <th className="description">{x.description}</th>
              <th>{x.category}</th>
              <th>{x.complexity}</th>
            </tr>
          ))}
        </table>
        <QuestionForm
          questions={questions}
          setQuestions={setQuestions}
          COMPLEXITY={COMPLEXITY}
        />
      </div>
    </div>
  );
}

export default QuestionPage;
