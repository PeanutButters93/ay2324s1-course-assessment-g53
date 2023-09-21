import { ReactDOM, useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import QuestionPage from "./pages/QuestionPage"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Layout from "./pages/Layout"
import UpdateUserProfilePage from "./pages/UpdateUserProfilePage"
import SignupPage from "./pages/SignupPage"
import RouteProtector from "./components/RouteProtector"
import { getTokenFromLocalStorage } from "./LocalStorage"
import AdminView from "./pages/AdminView"

const App = () => {
  const token = getTokenFromLocalStorage()
  const [isLoggedIn, setLoggedIn] = useState(token ? true : false);
  const [isAdmin, setIsAdmin] = useState(false);
  const updateAdminStatus = (status) => {
    setIsAdmin(status)
    console.log("status updated")
    console.log(status)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<SignupPage />} />
        <Route path="login" element={<Login setLoggedIn={setLoggedIn} updateAdminStatus={updateAdminStatus}/>} />
        <Route path="logout" element={<Logout setLoggedIn={setLoggedIn}/>} />
        <Route path="profile" element={<RouteProtector permission={isLoggedIn} link={"/login"}><UpdateUserProfilePage /></RouteProtector>} />
        <Route path="questionpage" element={<RouteProtector permission={isLoggedIn} link={"/login"}><QuestionPage /></RouteProtector>} />
        <Route path="adminview" element={<RouteProtector permission={isAdmin} link={"/questionpage"}><AdminView /></RouteProtector>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
