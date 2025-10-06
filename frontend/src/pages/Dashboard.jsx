import { useEffect, useState } from "react";
import { fetchDashboard } from "./api";
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
  const [stats, setStats] = useState({ students: 0, reports: 0, courses: 0, classes: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDashboard();
        setStats(res.data || {});
      } catch (err) {
        console.error("dashboard fetch:", err);
      }
    };
    load();
    const interval = setInterval(load, 10000); // live-ish refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ["Students", "Reports", "Courses", "Classes"],
    datasets: [
      {
        label: "Live numbers",
        data: [stats.students || 0, stats.reports || 0, stats.courses || 0, stats.classes || 0],
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
        <p className="text-gray-600">Overview of live stats and quick actions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard title="Students" value={stats.students} />
        <StatCard title="Reports" value={stats.reports} />
        <StatCard title="Courses" value={stats.courses} />
        <StatCard title="Classes" value={stats.classes} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-4">Live Overview</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

function StatCard({ title, value = 0 }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold text-blue-700">{value}</div>
    </div>
  );
}
