import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Lecturers from "./pages/Lecturers";
import Classes from "./pages/Classes";
import Reports from "./pages/Reports";
import Monitoring from "./pages/Monitoring";
import Rating from "./pages/Rating";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const { user } = useAuth();

  // Wrapper for private routes (requires login)
  const PrivateRoute = ({ element }) => (user ? element : <Navigate to="/login" replace />);

  // Wrapper for public routes (cannot access if logged in)
  const PublicRoute = ({ element }) => (!user ? element : <Navigate to="/" replace />);

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}

      <main className="p-6 max-w-7xl mx-auto">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/register" element={<PublicRoute element={<Register />} />} />
          <Route path="/register" element={<Register />} />


          {/* Private routes */}
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/students" element={<PrivateRoute element={<Students />} />} />
          <Route path="/lecturers" element={<PrivateRoute element={<Lecturers />} />} />
          <Route path="/classes" element={<PrivateRoute element={<Classes />} />} />
          <Route path="/courses" element={<PrivateRoute element={<Courses />} />} />
          <Route path="/reports" element={<PrivateRoute element={<Reports />} />} />
          <Route path="/monitoring" element={<PrivateRoute element={<Monitoring />} />} />
          <Route path="/rating" element={<PrivateRoute element={<Rating />} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
