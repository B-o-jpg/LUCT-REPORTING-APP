import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import luctLogo from "../assets/luct-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/auth/login", { email, password });
      const userData = res.data;

      // Save user and redirect based on role
      login(userData);

      // Role-based redirect
      switch (userData.role) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "lecturer":
          navigate("/lecturer/dashboard");
          break;
        case "prl":
          navigate("/prl/dashboard");
          break;
        case "pl":
          navigate("/pl/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left illustration panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-black-600 to-indigo-700 justify-center items-center">
        <div className="text-black p-10 text-center">
          {/* --- School Logo --- */}
          <img src={luctLogo} alt="LUCT Logo" className="w-60 mx-auto mb-6 drop-shadow-lg" />

          <h1 className="text-4xl font-bold mb-4">Welcome to LUCT Dashboard</h1>
          <p className="text-lg leading-relaxed">
            Login or Register to track students, courses, reports, and real-time analytics.
            Your administration, simplified.
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 m-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email field */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                required
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
