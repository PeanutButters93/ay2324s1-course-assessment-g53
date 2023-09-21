import { Navigate } from "react-router-dom";
const RouteProtector = ({ permission, children, link }) => {
  console.log(permission)
  if (!permission) {
    return <Navigate to={link} replace />;
  }
  return children;
};
export default RouteProtector;