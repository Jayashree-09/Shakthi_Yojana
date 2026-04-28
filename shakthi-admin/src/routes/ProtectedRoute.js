import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // ✅ New user — never registered, nothing in localStorage
  if (!token && !user) {
    return <Navigate to="/register" />;
  }

  // ✅ Existing user — registered & logged in before, but now logged out
  if (!token && user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;