import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import luctLogo from "../assets/luct-logo.png";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // get login from context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/auth/register", form);

      // On success, login the user in context
      const userData = {
        id: res.data.userId,
        name: form.name,
        email: form.email,
        role: form.role,
      };

      login(userData);

      // Redirect based on role
      switch (form.role) {
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
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={luctLogo} alt="LUCT Logo" className="w-60 mb-6" />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black-700 mb-4">
          Register Account
        </h2>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="prl">Principal Lecturer (PRL)</option>
            <option value="pl">Program Leader (PL)</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 w-full rounded"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
