// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // مش مسجل دخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // مش سوبر أدمن
  if (role !== "super_admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}