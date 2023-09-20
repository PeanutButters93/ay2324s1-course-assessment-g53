// Function to save questions to local storage
export const saveQuestionsToLocalStorage = (questions) => {
  localStorage.setItem("questions", JSON.stringify(questions));
};

// Function to get questions from local storage
export const getQuestionsFromLocalStorage = () => {
  const storedQuestions = localStorage.getItem("questions");
  return storedQuestions ? JSON.parse(storedQuestions) : null;
};

export const getTokenFromLocalStorage = () => {
  const storedToken = localStorage.getItem("jwt");
  return storedToken ? storedToken : null
}