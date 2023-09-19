import { ReactDOM } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import QuestionPage from "./pages/QuestionPage"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Layout from "./pages/Layout"
import UpdateUserProfilePage from "./pages/UpdateUserProfilePage"
import SignupPage from "./pages/SignupPage"
import { Link } from "react-router-dom"
import AdminView from "./pages/AdminView"



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<SignupPage />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="updateProfile" element={<UpdateUserProfilePage />} />
        <Route path="questionpage" element={<QuestionPage />} />
        <Route path="adminview" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
