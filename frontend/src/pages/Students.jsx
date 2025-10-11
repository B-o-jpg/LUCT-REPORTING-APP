import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState({ student_name: "", course: "" });

  // Load students from backend
  const loadStudents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Add a student
  const handleAddStudent = async () => {
    if (!newStudent.student_name || !newStudent.course) {
      return alert("All fields required");
    }
    try {
      await axios.post("http://localhost:4000/api/students", newStudent);
      setNewStudent({ student_name: "", course: "" });
      loadStudents(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  // Delete a student
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/students/${id}`);
      loadStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  // Export to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "students.xlsx");
  };

  // Filter for search
  const filtered = students.filter(
    s =>
      s.student_name.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Students</h2>

      <div className="flex mb-3 gap-2">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button className="bg-green-500 text-white px-4 rounded flex items-center gap-1" onClick={handleExport}>
          <FaFileExcel /> Export
        </button>
      </div>

      <div className="mb-4 p-3 border rounded">
        <h5 className="font-semibold flex items-center gap-1"><FaPlus /> Add Student</h5>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Student Name"
            value={newStudent.student_name}
            onChange={(e) => setNewStudent({ ...newStudent, student_name: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Course"
            value={newStudent.course}
            onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <button className="bg-blue-500 text-white px-4 rounded" onClick={handleAddStudent}>Add</button>
        </div>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.student_name}</td>
              <td className="border p-2">{s.course}</td>
              <td className="border p-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(s.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
