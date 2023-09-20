import { useEffect, useState } from "react";
import cookie from 'react-cookies'
import jwt_decode from "jwt-decode";

function updateCookies(newJwt) {
  cookie.save(
    '_auth',
    newJwt
  );

  var decoded = jwt_decode(newJwt)["userdata"];
  // #TODO filter out NULL
  cookie.save(
    'userdata',
    decoded
  );

}

function clearCookies() {
  cookie.remove('_auth')
  cookie.remove('userdata')
}

const useCookie = () => {
  const [jwt, setJwt] = useState("")
    return {updateCookies, clearCookies};
}

export default useCookie;