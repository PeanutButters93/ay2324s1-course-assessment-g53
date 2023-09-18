import * as React from "react";
import { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "../components/NavComponent";
import Question from "../components/question/Question";
import ViewQuestion from "../components/question/ViewQuestion";
import EditQuestion from "../components/question/EditQuestion";
import AddQuestion from "../components/question/AddQuestion";
import { getQuestionsFromLocalStorage, saveQuestionsToLocalStorage } from "../LocalStorage";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

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
    categories: "Strings, Algorithms",
    complexity: COMPLEXITY.EASY,
  },
  {
    id: 2,
    title: "Linked List Cycle Detection",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter. Return true if there is a cycle in the linked list. Otherwise, return false.",
    categories: "Data Structures, Algorithms",
    complexity: COMPLEXITY.EASY,
  },
];

const emptyTitleMessage = "Title cannot be empty!";
const emptyDescriptionMessage = "Description cannot be empty!";
const emptyCategoryMessage = "Category cannot be empty!";
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
  if (!title) {
    setEmptyTitleMessage(emptyTitleMessage);
  }
  if (!description) {
    setEmptyDescriptionMessage(emptyDescriptionMessage);
  }
  if (!category) {
    setEmptyCategoryMessage(emptyCategoryMessage);
  }
  if (!complexity) {
    setEmptyComplexityMessage(emptyComplexityMessage);
  }
  return;
}
function QuestionPage() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };


  const deleteQuestion = (question) => {
    console.log(question)
    const index = questions.indexOf(question);
    const questionRemoved = questions.filter((q) => q !== question);
    
    for (let i = index; i < questions.length-1; i++) {
      // Update the id of the questions after the deleted question
      questionRemoved[i].id = questionRemoved[i].id - 1;
    }
    setQuestions(questionRemoved);
    
    saveQuestionsToLocalStorage(questionRemoved);
  };

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
    const id = questions ? questions[questions.length -1].id + 1 : 1;
    const question = { id, title, description, categories, complexity };
    fetch("http://localhost:8000/api/questions", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(question)
    }).catch(error => {
      console.error('Error:', error);
      return;
  })
    console.log(question)
    console.log(questions)
    const updated_qns = [...questions, question]
    setQuestions(updated_qns);
    saveQuestionsToLocalStorage(updated_qns)
    return question;
  };

  const [questions, setQuestions] = useState(DEFAULT_QNS)
  const [viewPage, setViewPage] = useState(false);
  const [addPage, setAddPage] = useState(false);
  const [editPage, setEditPage] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  React.useEffect(() => {
    async function fetchQuestions() {
    const response = await fetch("http://localhost:8000/api/questions", {method: "GET"})
    const data = await response.json()
    console.log(data)
    const questions = []
    for (var i in data) {
      questions.push(data[i])
    }
    setQuestions(questions)
    }
    fetchQuestions()
  }, [])
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              QUESTIONS
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
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
                    setSelectedQuestion={setSelectedQuestion}
                    selectedQuestion={selectedQuestion}
                    deleteQuestion={deleteQuestion}
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
                    />
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default QuestionPage;