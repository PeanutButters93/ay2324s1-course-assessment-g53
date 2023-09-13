import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div>LAYOUT AFFECTS GIVEN PAGE</div>
      <Outlet />
    </>
  );
};

export default Layout;
