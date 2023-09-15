import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Title from "./Title";
import { useEffect, useState } from "react";

const AddQuestion = (props) => {
  const COMPLEXITY = props.COMPLEXITY;
  const setAddPage = props.setAddPage;
  const setViewPage = props.setViewPage;
  const checkEmpty = props.checkEmpty;
  const addQuestion = props.addQuestion;
  const selectedQuestion = props.selectedQuestion;
  const setSelectedQuestion = props.setSelectedQuestion;
  const duplicateCheckers = props.duplicateCheckers;
  const questions = props.questions;
  const duplicateMessages = props.duplicateMessages;

  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [complexity, setComplexity] = useState("");
  const [description, setDescription] = useState("");

  const [emptyTitleMessage, setEmptyTitleMessage] = useState("");
  const [emptyDescriptionMessage, setEmptyDescriptionMessage] = useState("");
  const [emptyCategoryMessage, setEmptyCategoryMessage] = useState("");
  const [emptyComplexityMessage, setEmptyComplexityMessage] = useState("");

  const [hasDuplicateTitle, setHasDuplicateTitle] = useState(false);
  const [hasDuplicateDescription, setHasDuplicateDescription] = useState(false);

  useEffect(() => {
    setHasDuplicateDescription(
      duplicateCheckers.checkDuplicateDescription(description, questions)
    );
  }, [description, questions, duplicateCheckers]);

  useEffect(() => {
    setHasDuplicateTitle(
      duplicateCheckers.checkDuplicateTitle(title, questions)
    );
  }, [title, questions, duplicateCheckers]);

  const handleAdd = () => {
    checkEmpty(
      title,
      setEmptyTitleMessage,
      description,
      setEmptyDescriptionMessage,
      categories,
      setEmptyCategoryMessage,
      complexity,
      setEmptyComplexityMessage
    );

    if (!title || !description || !categories || !complexity) {
      return;
    }

    if (hasDuplicateDescription || hasDuplicateTitle) {
      return;
    }

    const question = addQuestion(title, description, categories, complexity);
    setSelectedQuestion(question);
    setAddPage(false);
    setViewPage(true);
  };

  const handleCancel = () => {
    setAddPage(false);
    if (selectedQuestion != null) {
      setViewPage(true);
    }
  };
  const duplicateTitleMessage = hasDuplicateTitle
    ? duplicateMessages.title
    : "";
  const duplicateDescriptionMessage = hasDuplicateDescription
    ? duplicateMessages.description
    : "";

  return (
    <div>
      <Title>Add A New Question</Title>
      <TextField
        fullWidth
        label={"Title"}
        id="Title"
        margin="normal"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        // error={!!emptyTitleMessage}
        // helperText={emptyTitleMessage}
        error={!!emptyTitleMessage || !!duplicateTitleMessage}
        helperText={emptyTitleMessage || duplicateTitleMessage}
      />
      <TextField
        fullWidth
        label={"Categories"}
        id="Categories"
        margin="normal"
        value={categories}
        onChange={(event) => setCategories(event.target.value)}
        error={!!emptyCategoryMessage}
        helperText={emptyCategoryMessage}
      />
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel id="complexity" error={!!emptyComplexityMessage}>
          Complexity
        </InputLabel>
        <Select
          labelId="complexity"
          id="complexity"
          value={complexity}
          label="Complexity"
          onChange={(event) => setComplexity(event.target.value)}
          error={!!emptyComplexityMessage}
        >
          <MenuItem value="">
            <em>--Please select--</em>
          </MenuItem>
          <MenuItem value={COMPLEXITY.EASY}>EASY</MenuItem>
          <MenuItem value={COMPLEXITY.MEDIUM}>MEDIUM</MenuItem>
          <MenuItem value={COMPLEXITY.HARD}>HARD</MenuItem>
        </Select>
        <FormHelperText error>{emptyComplexityMessage}</FormHelperText>
      </FormControl>
      <TextField
        id="description"
        label={"Description"}
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        sx={{ marginTop: 2 }}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        // error={!!emptyDescriptionMessage}
        // helperText={emptyDescriptionMessage}
        error={emptyDescriptionMessage || duplicateDescriptionMessage}
        helperText={emptyDescriptionMessage || duplicateDescriptionMessage}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2, marginRight: 2 }}
        onClick={handleAdd}
      >
        Add Question
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleCancel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default AddQuestion;
