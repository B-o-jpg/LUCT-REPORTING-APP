import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Lecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState("");
  const [newLecturer, setNewLecturer] = useState({
    lecturer_name: "",
    faculty: "",
    email: "",
    department: ""
  });

  // Load lecturers from backend
  const loadLecturers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/lecturers");
      setLecturers(res.data);
    } catch (err) {
      console.error("Failed to load lecturers:", err);
    }
  };

  useEffect(() => {
    loadLecturers();
  }, []);

  // Add a new lecturer
  const handleAddLecturer = async () => {
    const { lecturer_name, faculty, email, department } = newLecturer;
    if (!lecturer_name || !faculty || !email || !department) return alert("All fields are required");

    try {
      await axios.post("http://localhost:4000/api/lecturers", newLecturer);
      setNewLecturer({ lecturer_name: "", faculty: "", email: "", department: "" });
      loadLecturers();
    } catch (err) {
      console.error(err);
      alert("Failed to add lecturer");
    }
  };

  // Delete a lecturer
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lecturer?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/lecturers/${id}`);
      loadLecturers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lecturer");
    }
  };

  // Export lecturers to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(lecturers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lecturers");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `lecturers_${Date.now()}.xlsx`);
  };

  // Filter lecturers
  const filtered = lecturers.filter(
    l =>
      l.lecturer_name.toLowerCase().includes(search.toLowerCase()) ||
      l.faculty.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Lecturers</h1>
        <button onClick={handleExport} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1">
          <FaFileExcel /> Export
        </button>
      </div>

      {/* Add lecturer form */}
      <div className="mb-4 p-3 border rounded">
        <h5 className="font-semibold flex items-center gap-1"><FaPlus /> Add Lecturer</h5>
        <div className="flex gap-2 mt-2 flex-wrap">
          <input
            type="text"
            placeholder="Name"
            value={newLecturer.lecturer_name}
            onChange={(e) => setNewLecturer({ ...newLecturer, lecturer_name: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Faculty"
            value={newLecturer.faculty}
            onChange={(e) => setNewLecturer({ ...newLecturer, faculty: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={newLecturer.email}
            onChange={(e) => setNewLecturer({ ...newLecturer, email: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Department"
            value={newLecturer.department}
            onChange={(e) => setNewLecturer({ ...newLecturer, department: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <button className="bg-blue-500 text-white px-4 rounded" onClick={handleAddLecturer}>Add</button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search lecturers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Lecturers table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Faculty</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(l => (
            <tr key={l.id}>
              <td className="border p-2">{l.lecturer_name}</td>
              <td className="border p-2">{l.faculty}</td>
              <td className="border p-2">{l.email}</td>
              <td className="border p-2">{l.department}</td>
              <td className="border p-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(l.id)}>
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
