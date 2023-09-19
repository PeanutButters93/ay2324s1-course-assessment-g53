import React from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

// #TODO turn into a button

const Logout = () => {
  useSignOut();
  // useNavigate("/login")
  return <div style={{ color: "white" }}>This is the logout page</div>;
};

export default Logout;
