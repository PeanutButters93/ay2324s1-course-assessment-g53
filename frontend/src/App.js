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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<SignupPage />} />

        <Route path="login" element={<Login setLoggedIn={setLoggedIn}/>} />
        <Route path="logout" element={<Logout setLoggedIn={setLoggedIn}/>} />
        <Route path="profile" element={<RouteProtector isLoggedIn={isLoggedIn}><UpdateUserProfilePage /></RouteProtector>} />
        <Route path="questionpage" element={<RouteProtector isLoggedIn={isLoggedIn}><QuestionPage /></RouteProtector>} />
        <Route path="adminview" element={<RouteProtector><AdminView /></RouteProtector>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
