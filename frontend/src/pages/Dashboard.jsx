import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
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

    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ["Students", "Lecturers", "Courses", "Classes", "Reports"],
    datasets: [
      {
        label: "Live numbers",
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
        <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
        <p className="text-gray-600">Overview of live stats and quick actions.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <StatCard title="Students" value={stats.totalStudents} />
        <StatCard title="Lecturers" value={stats.totalLecturers} />
        <StatCard title="Courses" value={stats.totalCourses} />
        <StatCard title="Classes" value={stats.totalClasses} />
        <StatCard title="Reports" value={stats.totalReports} />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-4">Live Overview</h2>
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
