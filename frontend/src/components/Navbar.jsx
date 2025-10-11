// Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaFileAlt, FaSignal, FaStar, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    "flex items-center gap-2 px-3 py-2 rounded-md " + 
    (isActive ? "bg-white text-blue-700 shadow" : "text-white/90 hover:bg-white/10");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: Brand */}
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">LUCT Reporting</div>
        <div className="hidden sm:flex items-center gap-2 text-sm opacity-90">
          <span className="px-2 py-1 rounded bg-green-500">Live</span>
          {user && (
            <span className="px-2 py-1 rounded bg-blue-800">
              {user.name} ({user.role})
            </span>
          )}
        </div>
      </div>

      {/* Right: Links */}
      <ul className="flex flex-wrap gap-2 items-center">
        <NavLink to="/" className={linkClass}><FaHome /> Dashboard</NavLink>
        <NavLink to="/students" className={linkClass}><FaUserGraduate /> Students</NavLink>
        <NavLink to="/lecturers" className={linkClass}><FaChalkboardTeacher /> Lecturers</NavLink>
        <NavLink to="/classes" className={linkClass}><FaBook /> Classes</NavLink>
        <NavLink to="/courses" className={linkClass}><FaBook /> Courses</NavLink>
        <NavLink to="/reports" className={linkClass}><FaFileAlt /> Reports</NavLink>
        <NavLink to="/monitoring" className={linkClass}><FaSignal /> Monitoring</NavLink>
        <NavLink to="/rating" className={linkClass}><FaStar /> Rating</NavLink>
        
        {/* Logout button */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        )}
      </ul>
    </nav>
  );
}
