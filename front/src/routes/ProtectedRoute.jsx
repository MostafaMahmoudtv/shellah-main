// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // مش مسجل دخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // لازم يكون Admin أو Super Admin
  if (
    role !== "super_admin" &&
    role !== "admin"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}