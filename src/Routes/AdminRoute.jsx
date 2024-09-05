import { Navigate } from "react-router-dom";
function AdminRoute({ children }) {
  let token = localStorage.getItem("token");
  let isAdmin = localStorage.getItem("isAdmin");

  if (token && isAdmin === "true" ) {
    return <> {children} </>;
  } else {
    return <Navigate to="/dashboard" />;
  }
}

export default AdminRoute;
