import { ReactDOM } from "react";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Layout from "./pages/Layout";

//createBrowserAdaptor adapted from https://www.youtube.com/watch?v=5s57C7leXc4

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<QuestionPage />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
    </Route>)
);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
