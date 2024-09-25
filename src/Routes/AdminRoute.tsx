import { Navigate } from "react-router-dom";
import React from 'react';

function AdminRoute({ children }: { children: React.ReactNode }) {
  let token = localStorage.getItem("token");
  let isAdmin = localStorage.getItem("isAdmin");

  if (token && isAdmin === "true") {
    return <>{children}</>; 
  } else {
    return <Navigate to="/" />;
  }
}

export default AdminRoute;
