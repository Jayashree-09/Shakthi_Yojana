import React from "react";
import AppRoutes from "./routes/AppRoutes";
// import { BrowserRouter as Router } from "react-router-dom"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import AdminRoles from "./pages/AdminRoles";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/admin/roles" element={<AdminRoles />} />
      </Routes>
    </>
  );
}

export default App;






