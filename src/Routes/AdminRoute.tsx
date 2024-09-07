import { Navigate } from "react-router-dom";
import React from 'react';

function AdminRoute({ children }: { children: React.ReactNode }) {
  let token = localStorage.getItem("token");
  let isAdmin = localStorage.getItem("isAdmin");

  // Check if the token and isAdmin are valid
  if (token && isAdmin === "true") {
    return <>{children}</>; // If authenticated and admin, allow access
  } else {
    // If not authenticated or not admin, redirect to the login page
    return <Navigate to="/" />;
  }
}

export default AdminRoute;
