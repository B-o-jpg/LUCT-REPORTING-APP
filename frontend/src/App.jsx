import React from "react";
import { Routes, Route } from "react-router-dom";
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
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/lecturers" element={<Lecturers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
