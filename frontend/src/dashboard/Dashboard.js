import * as React from 'react';
import { useState } from "react";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Orders from './Orders';
import ViewQuestion from './ViewQuestion';
import EditQuestion from './EditQuestion';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
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

const emptyTitleMessage = 'Title cannot be empty!';
const emptyDescriptionMessage = 'Description cannot be empty!';
const emptyCategoryMessage = 'Category cannot be empty!';
const emptyComplexityMessage = 'Complexity cannot be empty!';

const duplicateTitleMessage = 'A question with this title already exists!';
const duplicateDescriptionMessage = 'A question with this description already exists!';

function checkEmpty(title, setEmptyTitleMessage, description, setEmptyDescriptionMessage, category, setEmptyCategoryMessage, complexity, setEmptyComplexityMessage) {
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

export default function Dashboard() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // const checkDuplicates = (title, setDuplicateTitleMessage, description, setDuplicateDescriptionMessage) => {
    //     if (checkDuplicateTitle(title)) {
    //         setDuplicateTitleMessage(duplicateTitleMessage);
    //     }
    //     if (checkDuplicateDescription(description)) {    
    //         setDuplicateDescriptionMessage(duplicateDescriptionMessage);
    //     }
    //     return;
    // }

    // const checkDuplicateTitle = (title, setDuplicateTitleMessage) => {
    //     return questions.some(
    //         question => question.title === title
    //     );
    // }
    // const checkDuplicateTitle = (title, setDuplicateTitleMessage, duplicateTitleMessage1) => {
    //     if (questions.some(question => question.title === title)) {
    //         setDuplicateTitleMessage(duplicateTitleMessage);
    //         console.log("duplicate found");
    //         console.log(duplicateTitleMessage1);
    //     }
    // }

    // const checkDuplicateDescription = (description) => {
    //     return questions.some(
    //         question => question.description === description
    //     );
    // }
    // const checkDuplicateDescription = (description, setDuplicateDescriptionMessage) => {
    //     if (questions.some(question => question.description === description)) {
    //         setDuplicateDescriptionMessage(duplicateDescriptionMessage);
    //     }
    // }

    const [questions, setQuestions] = useState(DEFAULT_QNS);
    const [viewPage, setViewPage] = useState(false);
    const [editPage, setEditPage] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    return (
        <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
            <Toolbar
                sx={{
                pr: '24px', // keep right padding when drawer closed
                }}
            >
                <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
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
                Dashboard
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
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
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}> {/* Set spacing to 0 */}
                        {/* Questions */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}}>
                                <Orders 
                                    questions={questions} 
                                    setViewPage={setViewPage} 
                                    setEditPage={setEditPage} 
                                    setSelectedQuestion={setSelectedQuestion} 
                                    selectedQuestion={selectedQuestion} />
                            </Paper>
                        </Grid>

                        {/* View Question */}
                        {viewPage && <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width:'110%'}}>
                                <ViewQuestion question={selectedQuestion}/>
                            </Paper>
                        </Grid>}

                        {/* Edit Question */}
                        {editPage && <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width:'110%' }}>
                                <EditQuestion 
                                  question={ selectedQuestion } 
                                  COMPLEXITY={ COMPLEXITY }
                                  setViewPage={ setViewPage } 
                                  setEditPage={ setEditPage }
                                  checkEmpty={ checkEmpty }
                                //   checkDuplicates={ checkDuplicates } 
                                //   checkDuplicateTitle={ checkDuplicateTitle } 
                                //   checkDuplicateDescription={ checkDuplicateDescription } 
                                />
                            </Paper>
                        </Grid>}
                    </Grid>
                </Container>
            </Box>
        </Box>
        </ThemeProvider>
    );
}
