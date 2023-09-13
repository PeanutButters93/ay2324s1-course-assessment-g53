import { ReactDOM } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Layout from "./pages/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<QuestionPage />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
