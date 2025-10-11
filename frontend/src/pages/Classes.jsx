import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaTrash, FaPlus, FaFileExcel } from "react-icons/fa";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    course_id: "",
    lecturer_id: "",
    scheduled_time: "",
    venue: "",
  });

  const BASE_URL = "http://localhost:4000/api/classes";

  // Load classes from backend
  const loadClasses = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setClasses(res.data || []);
    } catch (err) {
      console.error("Failed to load classes:", err);
      alert("Failed to load classes. Check backend and API route.");
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Add new class
  const handleAddClass = async (e) => {
    e.preventDefault();
    const { name, course_id, lecturer_id, scheduled_time, venue } = form;
    if (!name || !course_id || !lecturer_id || !scheduled_time || !venue) {
      return alert("All fields are required");
    }

    try {
      await axios.post(BASE_URL, form);
      setForm({ name: "", course_id: "", lecturer_id: "", scheduled_time: "", venue: "" });
      loadClasses(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to add class");
    }
  };

  // Delete a class
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      loadClasses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete class");
    }
  };

  // Export classes to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(classes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classes");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `classes_${Date.now()}.xlsx`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Classes</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
          onClick={handleExport}
        >
          <FaFileExcel /> Export
        </button>
      </div>

      {/* Add Class Form */}
      <form onSubmit={handleAddClass} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 border p-4 rounded bg-white shadow">
        <input
          type="text"
          placeholder="Class Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Course ID"
          value={form.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Lecturer ID"
          value={form.lecturer_id}
          onChange={(e) => setForm({ ...form, lecturer_id: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="datetime-local"
          placeholder="Scheduled Time"
          value={form.scheduled_time}
          onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded col-span-1 sm:col-span-5 mt-2 sm:mt-0">
          <FaPlus /> Add Class
        </button>
      </form>

      {/* Classes Table */}
      <table className="w-full border bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Course ID</th>
            <th className="border p-2">Lecturer ID</th>
            <th className="border p-2">Scheduled Time</th>
            <th className="border p-2">Venue</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.course_id}</td>
              <td className="border p-2">{c.lecturer_id}</td>
              <td className="border p-2">{new Date(c.scheduled_time).toLocaleString()}</td>
              <td className="border p-2">{c.venue}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(c.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
