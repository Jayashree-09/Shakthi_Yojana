import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Logs from "../pages/Logs";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import AadhaarScanner from "../pages/AadhaarScanner";
import AdminRoles from "../pages/AdminRoles";

// Components
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";

function AppRoutes() {
  return (
    <Routes>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
      />
      <Route
        path="/users"
        element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>}
      />
      <Route
        path="/logs"
        element={<ProtectedRoute><Layout><Logs /></Layout></ProtectedRoute>}
      />
      <Route
        path="/reports"
        element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>}
      />

      {/* Aadhaar Scanner */}
      <Route
        path="/scanner"
        element={<ProtectedRoute><Layout><AadhaarScanner /></Layout></ProtectedRoute>}
      />

      {/* 404 */}
      <Route
        path="*"
        element={<h2 style={{ padding: "40px" }}>404 — Page Not Found</h2>}
      />
      <Route
  path="/admin/roles"
  element={<ProtectedRoute><Layout><AdminRoles /></Layout></ProtectedRoute>}
/>

    </Routes>
  );
}

export default AppRoutes;