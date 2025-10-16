import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaChalkboardTeacher, FaBook, FaFileAlt, FaSignal, FaStar, FaSignOutAlt } from "react-icons/fa";
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

  if (!user) return null; // hide navbar if not logged in

  // Determine links based on role
  let links = [];

  switch (user.role) {
    case "student":
      links = [
        { to: "/monitoring", label: "Monitoring", icon: <FaSignal /> },
        { to: "/rating", label: "Rating", icon: <FaStar /> },
      ];
      break;

    case "lecturer":
      links = [
        { to: "/classes", label: "Classes", icon: <FaBook /> },
        { to: "/reports", label: "Reports", icon: <FaFileAlt /> },
        { to: "/monitoring", label: "Monitoring", icon: <FaSignal /> },
        { to: "/rating", label: "Rating", icon: <FaStar /> },
      ];
      break;

    case "prl":
      links = [
        { to: "/courses", label: "Courses", icon: <FaBook /> },
        { to: "/reports", label: "Reports", icon: <FaFileAlt /> },
        { to: "/classes", label: "Classes", icon: <FaBook /> },
        { to: "/monitoring", label: "Monitoring", icon: <FaSignal /> },
        { to: "/rating", label: "Rating", icon: <FaStar /> },
      ];
      break;

    case "pl":
      links = [
        { to: "/courses", label: "Courses", icon: <FaBook /> },
        { to: "/reports", label: "Reports", icon: <FaFileAlt /> },
        { to: "/classes", label: "Classes", icon: <FaBook /> },
        { to: "/lecturers", label: "Lecturers", icon: <FaChalkboardTeacher /> },
        { to: "/monitoring", label: "Monitoring", icon: <FaSignal /> },
        { to: "/rating", label: "Rating", icon: <FaStar /> },
      ];
      break;

    default:
      links = [];
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: Brand */}
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">LUCT Reporting</div>
        <div className="hidden sm:flex items-center gap-2 text-sm opacity-90">
          <span className="px-2 py-1 rounded bg-green-500">Live</span>
          <span className="px-2 py-1 rounded bg-blue-800">
            {user.name} ({user.role.toUpperCase()})
          </span>
        </div>
      </div>

      {/* Right: Links */}
      <ul className="flex flex-wrap gap-2 items-center">
        <NavLink to="/" className={linkClass}><FaHome /> Dashboard</NavLink>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            {link.icon} {link.label}
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </ul>
    </nav>
  );
}
