import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalReports: 0,
    totalCourses: 0,
    totalClasses: 0,
    totalLecturers: 0,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/dashboard/counts");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Role-based modules ---
  const modulesByRole = {
    student: [
      { title: "Monitoring", path: "/monitoring" },
      { title: "Rating", path: "/rating" },
    ],
    lecturer: [
      { title: "Classes", path: "/classes" },
      { title: "Reports", path: "/reports" },
      { title: "Monitoring", path: "/monitoring" },
      { title: "Rating", path: "/rating" },
    ],
    prl: [
      { title: "Courses", path: "/courses" },
      { title: "Reports", path: "/reports" },
      { title: "Monitoring", path: "/monitoring" },
      { title: "Rating", path: "/rating" },
      { title: "Classes", path: "/classes" },
    ],
    pl: [
      { title: "Courses", path: "/courses" },
      { title: "Reports", path: "/reports" },
      { title: "Monitoring", path: "/monitoring" },
      { title: "Classes", path: "/classes" },
      { title: "Lectures", path: "/lectures" },
      { title: "Rating", path: "/rating" },
    ],
  };

  const modules = modulesByRole[user?.role] || [];

  // --- Chart Data ---
  const chartData = {
    labels: ["Students", "Lecturers", "Courses", "Classes", "Reports"],
    datasets: [
      {
        label: "Live Statistics",
        data: [
          stats.totalStudents,
          stats.totalLecturers,
          stats.totalCourses,
          stats.totalClasses,
          stats.totalReports,
        ],
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
          <p className="text-gray-600">
            Welcome, <strong>{user?.name}</strong> ({user?.role?.toUpperCase()})
          </p>
        </div>
      </div>

      {/* Quick Actions / Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {modules.map((mod) => (
          <button
            key={mod.title}
            onClick={() => navigate(mod.path)}
            className="bg-blue-600 text-white text-lg font-semibold rounded-lg py-6 shadow hover:bg-blue-700 transition"
          >
            {mod.title}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        {user?.role === "student" && (
          <>
            <StatCard title="Your Ratings" value={stats.totalReports || 0} />
            <StatCard title="Monitored Classes" value={stats.totalClasses || 0} />
          </>
        )}

        {user?.role === "lecturer" && (
          <>
            <StatCard title="My Classes" value={stats.totalClasses} />
            <StatCard title="Reports Submitted" value={stats.totalReports} />
            <StatCard title="Courses" value={stats.totalCourses} />
          </>
        )}

        {user?.role === "prl" && (
          <>
            <StatCard title="Courses in Stream" value={stats.totalCourses} />
            <StatCard title="Reports Reviewed" value={stats.totalReports} />
            <StatCard title="Lecturers" value={stats.totalLecturers} />
          </>
        )}

        {user?.role === "pl" && (
          <>
            <StatCard title="Courses Managed" value={stats.totalCourses} />
            <StatCard title="Reports Received" value={stats.totalReports} />
            <StatCard title="Lecturers" value={stats.totalLecturers} />
            <StatCard title="Classes" value={stats.totalClasses} />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-4 text-blue-700">Live Overview</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

// Individual stat card
function StatCard({ title, value = 0 }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold text-blue-700">{value}</div>
    </div>
  );
}
