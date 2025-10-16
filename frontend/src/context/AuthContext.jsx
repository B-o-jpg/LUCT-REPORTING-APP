import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage (persist login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- Login ---
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect to dashboard based on role
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
  };

  // --- Logout ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- Role-based route guard ---
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
