import * as React from "react";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Question from "../components/question/Question";
import ViewQuestion from "../components/question/ViewQuestion";
import EditQuestion from "../components/question/EditQuestion";
import AddQuestion from "../components/question/AddQuestion";
import { getQuestionsFromLocalStorage, saveQuestionsToLocalStorage } from "../LocalStorage";
import axios from 'axios';
import useCookie from "../components/useCookie";
import Categories from "../components/question/Categories";

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
    categories: ["Strings", "Algorithms"],
    complexity: COMPLEXITY.EASY,
  },
  {
    id: 2,
    title: "Linked List Cycle Detection",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter. Return true if there is a cycle in the linked list. Otherwise, return false.",
    categories: ["Data Structures", "Algorithms"],
    complexity: COMPLEXITY.EASY,
  },
];
const QUESTION_HOST = process.env.REACT_APP_QUESTION_HOST ? process.env.REACT_APP_QUESTION_HOST : "http://localhost:8000/api/questions"
const emptyTitleMessage = "Title cannot be empty!";
const emptyDescriptionMessage = "Description cannot be empty!";
const emptyCategoryMessage = "Please select a category!";
const emptyComplexityMessage = "Complexity cannot be empty!";

const duplicateMessages = {
  title: "A question with this title already exists!",
  description: "A question with this description already exists!",
};

function checkEmpty(
  title,
  setEmptyTitleMessage,
  description,
  setEmptyDescriptionMessage,
  category,
  setEmptyCategoryMessage,
  complexity,
  setEmptyComplexityMessage
) {
    if (title) {
        setEmptyTitleMessage("");
    } else {
        setEmptyTitleMessage(emptyTitleMessage);
    }

    if (description) {
        setEmptyDescriptionMessage("");
    } else {
        setEmptyDescriptionMessage(emptyDescriptionMessage);
    }

    if (category.length !== 0) {
        setEmptyCategoryMessage("");
    } else {
        setEmptyCategoryMessage(emptyCategoryMessage);
    }

    if (complexity) {
        setEmptyComplexityMessage("");
    } else {
        setEmptyComplexityMessage(emptyComplexityMessage);
    }

    return;
}

function QuestionPage() {
    const {getAuthCookie} = useCookie();

    const checkDuplicateTitle = (title, questions) => {
        return questions.some((question) => question.title === title);
    };

    const checkDuplicateDescription = (description, questions) => {
        return questions.some((question) => question.description === description);
    };

    const duplicateCheckers = {
        checkDuplicateDescription: checkDuplicateDescription,
        checkDuplicateTitle: checkDuplicateTitle,
    };
    let localStorage = getQuestionsFromLocalStorage()
    if (localStorage === null) {
        saveQuestionsToLocalStorage(DEFAULT_QNS);
        localStorage = DEFAULT_QNS;
    }

    async function addQuestion(title, description, categories, complexity, questions) {
        const id = questions ? questions[questions.length - 1].id + 1 : 1;
        const question = { id, title, description, categories, complexity };
        axios.post(QUESTION_HOST, question, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthCookie()
        },
        }).catch(error => {
        console.error('Error:', error);
        return;
    })
        const updated_qns = [...questions, question]
        setQuestions(updated_qns);
        return question;
    };

    async function editQuestion(questionToEdit, title, description, categories, complexity, questions) {
        const id = questionToEdit.id;
        const question = {id, title, description, categories, complexity}
        await axios.put(QUESTION_HOST, question, {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': getAuthCookie()
        },
        }).catch(error => {
        console.error('Error:', error);
        return;
        })
        const res = [...questions, question].sort((a,b) => a.id - b.id)
        setQuestions(res);
        return question;
    }

    async function deleteQuestion(questionToDelete, questions) {
        console.log(questionToDelete);
        await axios.delete(`${QUESTION_HOST}/${questionToDelete.id}`, {
            headers: {
                'Authorization': getAuthCookie()
            }
        }).catch(error => {
        console.error('Error:', error);
        return;
        })
        setQuestions(questions.filter(x => x.id !== questionToDelete.id));
    }

    const [questions, setQuestions] = useState(DEFAULT_QNS)
    const [viewPage, setViewPage] = useState(false);
    const [addPage, setAddPage] = useState(false);
    const [editPage, setEditPage] = useState(false);
    const [categoriesPage, setCategoriesPage] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [buttonClickCount, setButtonClickCount] = useState(0); // For lack of better options
    const [filteredQuestions, setFilteredQuestions] = useState(questions);

    React.useEffect(() => {
        async function fetchQuestions() {
            console.log("Here is the process env question host value")
            console.log(process.env.REACT_APP_QUESTION_HOST)
            console.log("Here is the process env user host value")
            console.log(process.env.REACT_APP_USER_HOST)


            const response = await axios.get(QUESTION_HOST, {
                headers: {
                    'Authorization': getAuthCookie()
                }
            })
            const data = response.data
            const questions = []
            for (var i in data) {
                questions.push(data[i])
            }
            setQuestions(questions)
            setFilteredQuestions(questions)
        }
        fetchQuestions()
    }, [buttonClickCount]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                {" "}
                {/* Set spacing to 0 */}
                {/* Questions */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                    <Question
                        questions={questions}
                        setAddPage={setAddPage}
                        setViewPage={setViewPage}
                        setEditPage={setEditPage}
                        setCategoriesPage={setCategoriesPage}
                        setSelectedQuestion={setSelectedQuestion}
                        selectedQuestion={selectedQuestion}
                        filteredQuestions={filteredQuestions}
                        setFilteredQuestions={setFilteredQuestions}
                        deleteQuestion={deleteQuestion}
                        buttonClickCount={buttonClickCount}
                    />
                    </Paper>
                </Grid>
                {/* View Question */}
                {viewPage && (
                    <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        width: "110%",
                        }}
                    >
                        <ViewQuestion
                        question={selectedQuestion}
                        addPage={setAddPage}
                        />
                    </Paper>
                    </Grid>
                )}
                {/* Add Question */}
                {addPage && (
                    <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        width: "110%",
                        }}
                    >
                        <AddQuestion
                        COMPLEXITY={COMPLEXITY}
                        setAddPage={setAddPage}
                        setViewPage={setViewPage}
                        checkEmpty={checkEmpty}
                        addQuestion={addQuestion}
                        duplicateCheckers={duplicateCheckers}
                        selectedQuestion={selectedQuestion}
                        setSelectedQuestion={setSelectedQuestion}
                        questions={questions}
                        duplicateMessages={duplicateMessages}
                        setQuestions={setQuestions}
                        />
                    </Paper>
                    </Grid>
                )}
                {/* Edit Question */}
                {editPage && (
                    <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        width: "110%",
                        }}
                    >
                        <EditQuestion
                        question={selectedQuestion}
                        COMPLEXITY={COMPLEXITY}
                        setViewPage={setViewPage}
                        setEditPage={setEditPage}
                        checkEmpty={checkEmpty}
                        questions={questions}
                        duplicateCheckers={duplicateCheckers}
                        duplicateMessages={duplicateMessages}
                        editQuestion={editQuestion}
                        setSelectedQuestion={setSelectedQuestion}
                        />
                    </Paper>
                    </Grid>
                )}
                {/* Categories */}
                {categoriesPage && (
                    <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        width: "110%",
                        }}
                    >
                        <Categories
                            setCategoriesPage={setCategoriesPage}
                            buttonClickCount={buttonClickCount}
                            setButtonClickCount={setButtonClickCount}
                        />
                    </Paper>
                    </Grid>
                )}
                </Grid>
            </Container>
        </Box>
    );
}

export default QuestionPage;