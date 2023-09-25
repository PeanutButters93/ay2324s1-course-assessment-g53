import { ReactDOM, useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import QuestionPage from "./pages/QuestionPage"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Layout from "./pages/Layout"
import UpdateUserProfilePage from "./pages/UpdateUserProfilePage"
import SignupPage from "./pages/SignupPage"
import RouteProtector from "./components/RouteProtector"
import AdminView from "./pages/AdminView"
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "./store"
import useCookie from "./components/useCookie"
import UserProfile from "./pages/UserProfile"

// const canRenderOnlyLogin = (isLoggedIn, route) => {
//   return isLoggedIn ? route : null
// }

const App = () => {

  const isLogin = useSelector((state) => state.auth.isLoggedIn)
  const is_admin = useSelector((state) => state.auth.is_admin)
  const dispatch = useDispatch()
  const { getAuthCookie } = useCookie()

  useEffect(() => {
    const token = getAuthCookie()
    if (token) {
      dispatch(authActions.setLogin(true))
      const tokenBody = token.split('.')[1]
      let buffer = JSON.parse(atob(tokenBody))
      if (buffer.user_data.is_admin) {
        dispatch(authActions.setAdmin(true))
      }
    }
  }, [])
  //console.log(isLogin, is_admin)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Login />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="logout" element={<Logout />} />
        {isLogin ? <Route path="updateprofile" element={<UpdateUserProfilePage />} /> : null}
        {isLogin ? <Route path="questionpage" element={<QuestionPage />} /> : null}
        {isLogin ? <Route path="userprofile" element={<UserProfile />} /> : null}
        {is_admin ? <Route path="adminview" element={<AdminView />} /> : null}
      </Routes>
    </BrowserRouter>
  )

}

export default App
