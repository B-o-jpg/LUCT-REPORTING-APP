import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaTrash, FaPlus, FaFileExcel } from "react-icons/fa";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", lecturer_id: "" });
  const BASE_URL = "http://localhost:4000/api/courses";

  // Load courses
  const loadCourses = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      alert("Failed to load courses. Check backend and API route.");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Add course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    const { name, code, lecturer_id } = form;
    if (!name || !code || !lecturer_id) return alert("All fields are required");

    try {
      await axios.post(BASE_URL, form);
      setForm({ name: "", code: "", lecturer_id: "" });
      loadCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to add course");
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      loadCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  // Export courses
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(courses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Courses");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `courses_${Date.now()}.xlsx`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Courses</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1" onClick={handleExport}>
          <FaFileExcel /> Export
        </button>
      </div>

      <form onSubmit={handleAddCourse} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 border p-4 rounded bg-white shadow">
        <input
          type="text"
          placeholder="Course Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Course Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded col-span-1 sm:col-span-4 mt-2 sm:mt-0">
          <FaPlus /> Add Course
        </button>
      </form>

      <table className="w-full border bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Lecturer ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.lecturer_id}</td>
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
