import React, { useEffect, useState } from "react";
import { fetchMonitoring, addMonitoring, updateMonitoring, deleteMonitoring } from "./api";
import SearchBar from "../components/SearchBar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../context/AuthContext";

export default function Monitoring() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Form for adding new monitoring record
  const [newRecord, setNewRecord] = useState({
    faculty_name: "",
    class_name: "",
    week: 1,
    date_of_lecture: "",
    course_name: "",
    course_code: "",
    lecturer_name: "",
    actual_students: 0,
    total_students: 0,
    venue: "",
    scheduled_time: "",
    topic: "",
    learning_outcomes: "",
    recommendations: "",
  });

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const res = await fetchMonitoring();
      setRows(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Export visible rows to Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monitoring");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `monitoring_${Date.now()}.xlsx`);
  };

  const getColumns = () => {
    if (!rows[0]) return [];
    const allCols = Object.keys(rows[0]);
    switch (user.role) {
      case "student":
        return ["faculty_name", "class_name", "course_name", "date_of_lecture", "actual_students", "total_students"];
      case "lecturer":
        return ["faculty_name", "class_name", "week", "date_of_lecture", "course_name", "topic", "actual_students", "total_students", "venue"];
      case "prl":
        return ["faculty_name", "class_name", "week", "date_of_lecture", "course_name", "topic", "actual_students", "total_students", "venue", "lecturer_name"];
      case "pl":
        return [...allCols];
      default:
        return ["faculty_name", "class_name", "course_name", "date_of_lecture"];
    }
  };

  const columns = getColumns();

  // Add missing_students field
  const rowsWithMissing = rows.map(r => ({
    ...r,
    missing_students: r.total_students - r.actual_students,
  }));

  // Filter rows by search query
  const filtered = rowsWithMissing.filter(r =>
    JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  );

  // Sort rows by attendance ratio
  const sortedRows = [...filtered].sort((a, b) => {
    const aRatio = a.actual_students / a.total_students;
    const bRatio = b.actual_students / b.total_students;
    return sortAsc ? aRatio - bRatio : bRatio - aRatio;
  });

  const getRowColor = (r) => {
    const ratio = r.actual_students / r.total_students;
    if (ratio < 0.5) return "bg-yellow-200";
    if (r.actual_students < r.total_students) return "bg-red-100";
    return "bg-green-100";
  };

  // Inline editing
  const handleEdit = async (id, field, value) => {
    const updatedValue = Number(value);
    if (isNaN(updatedValue) || updatedValue < 0) return;
    try {
      await updateMonitoring(id, { [field]: updatedValue });
      setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: updatedValue } : r));
    } catch (err) {
      console.error("Failed to update monitoring:", err);
    }
  };

  // Add new record
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await addMonitoring(newRecord);
      setRows(prev => [res.data, ...prev]); // instantly add
      setNewRecord({
        faculty_name: "",
        class_name: "",
        week: 1,
        date_of_lecture: "",
        course_name: "",
        course_code: "",
        lecturer_name: "",
        actual_students: 0,
        total_students: 0,
        venue: "",
        scheduled_time: "",
        topic: "",
        learning_outcomes: "",
        recommendations: "",
      });
    } catch (err) {
      console.error("Failed to add monitoring record:", err);
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    try {
      await deleteMonitoring(id);
      setRows(prev => prev.filter(r => r.id !== id)); // instantly remove
    } catch (err) {
      console.error("Failed to delete monitoring record:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Monitoring</h1>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded">Export Excel</button>
          <button onClick={() => setSortAsc(!sortAsc)} className="bg-blue-600 text-white px-3 py-2 rounded">
            Sort by Attendance {sortAsc ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter monitoring entries..." />

      {(user.role === "prl" || user.role === "pl") && (
        <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded mb-4 grid grid-cols-3 gap-2">
          {Object.keys(newRecord).map(key => (
            <input
              key={key}
              placeholder={key.replace(/_/g, " ")}
              value={newRecord[key]}
              type={key.includes("students") || key === "week" ? "number" : "text"}
              onChange={(e) => setNewRecord(prev => ({ ...prev, [key]: e.target.value }))}
              className="border rounded p-1"
              required
            />
          ))}
          <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded col-span-1">Add Monitoring</button>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(c => <th key={c} className="p-2 text-left text-sm">{c.replace(/_/g, " ")}</th>)}
              {(user.role === "prl" || user.role === "pl") && <th className="p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map(r => (
              <tr key={r.id} className={`border-b last:border-0 ${getRowColor(r)}`}>
                {columns.map(c => (
                  <td key={c} className="p-2 text-sm">
                    {c === "actual_students" && (user.role === "lecturer" || user.role === "prl") ? (
                      <input
                        type="number"
                        value={r.actual_students}
                        onChange={(e) => handleEdit(r.id, c, e.target.value)}
                        className="w-16 border rounded px-1"
                      />
                    ) : (
                      r[c]
                    )}
                  </td>
                ))}
                {(user.role === "prl" || user.role === "pl") && (
                  <td className="p-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
