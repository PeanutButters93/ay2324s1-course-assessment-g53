import { ReactDOM, useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import QuestionPage from "./pages/QuestionPage"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Layout from "./pages/Layout"
import UpdateUserProfilePage from "./pages/UpdateUserProfilePage"
import SignupPage from "./pages/SignupPage"
import RouteProtector from "./components/RouteProtector"
import { getTokenFromLocalStorage } from "./LocalStorage"
import AdminView from "./pages/AdminView"
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "./store"

// const canRenderOnlyLogin = (isLoggedIn, route) => {
//   return isLoggedIn ? route : null
// }

const App = () => {

  const isLogin = useSelector((state) => state.auth.isLoggedIn)
  const isAdministrator = useSelector((state) => state.auth.isAdmin)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = getTokenFromLocalStorage()
    if (token) {
      dispatch(authActions.setLogin(true))
      const tokenBody = token.split('.')[1]
      let buffer = JSON.parse(atob(tokenBody))
      console.log(buffer)
      if (buffer.is_admin) {
        dispatch(authActions.setAdmin(true))
      }
    }
  }, [])
  console.log(isLogin, isAdministrator)
  // console.log(isLogin, isAdministrator, isAdministrator ? <Route path="adminview" element={<AdminView/>}/> : null)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<SignupPage />} />
        <Route path="login" element={<Login/>} />
        <Route path="logout" element={<Logout />} />
        {isLogin ? <Route path="profile" element={<UpdateUserProfilePage />}/> : null}
        {isLogin ? <Route path="questionpage" element={<QuestionPage />} /> : null}
        {isAdministrator ? <Route path="adminview" element={<AdminView/>}/> : null}
      </Routes>
    </BrowserRouter>
  )
}

export default App
