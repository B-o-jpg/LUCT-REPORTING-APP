import React, { useEffect, useState } from "react";
import { fetchCourses } from "./api";
import SearchBar from "../components/SearchBar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchCourses();
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch courses");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(courses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Courses");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `courses_${Date.now()}.xlsx`);
  };

  const filtered = courses.filter(c => `${c.name} ${c.code}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Courses</h1>
        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded">Export Excel</button>
      </div>

      <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses..." />

      <ul className="space-y-3">
        {filtered.map((c) => (
          <li key={c.id || c._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-600">{c.code}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
