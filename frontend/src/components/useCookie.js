import { useState } from "react";
import cookie from 'react-cookies'
import jwt_decode from "jwt-decode";

function getAuthCookie() {
  return cookie.load('_auth');
}

function updateCookies(newJwt) {
  cookie.save(
    '_auth',
    newJwt
  );

  var decoded = jwt_decode(newJwt)["user_data"];
  cookie.save(
    'user_data',
    decoded
  );

}

function clearCookies() {
  cookie.remove('_auth')
  cookie.remove('user_data')
}

const useCookie = () => {
  const [jwt, setJwt] = useState("")
    return {getAuthCookie, updateCookies, clearCookies};
}

export default useCookie;