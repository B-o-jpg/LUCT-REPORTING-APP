import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaPlus, FaFileExcel } from "react-icons/fa";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    lecturer_id: "",
    class_id: "",
    week: "",
    date_of_lecture: "",
    topic: "",
    learning_outcomes: "",
    recommendations: "",
    actual_students: "",
    total_students: "",
  });

  const BASE_URL = "http://localhost:4000/api/reports";

  const loadReports = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setReports(res.data || []);
    } catch (err) {
      console.error("Failed to load reports:", err);
      alert("Failed to load reports. Check backend and API route.");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleAddReport = async (e) => {
    e.preventDefault();
    const { lecturer_id, class_id, week, date_of_lecture, topic } = form;
    if (!lecturer_id || !class_id || !week || !date_of_lecture || !topic) {
      return alert("Required fields missing");
    }
    try {
      await axios.post(BASE_URL, form);
      setForm({
        lecturer_id: "",
        class_id: "",
        week: "",
        date_of_lecture: "",
        topic: "",
        learning_outcomes: "",
        recommendations: "",
        actual_students: "",
        total_students: "",
      });
      loadReports();
    } catch (err) {
      console.error(err);
      alert("Failed to add report");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      loadReports();
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `reports_${Date.now()}.xlsx`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Reports</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1" onClick={handleExport}>
          <FaFileExcel /> Export
        </button>
      </div>

      <form onSubmit={handleAddReport} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 border p-4 rounded bg-white shadow">
        <input type="number" placeholder="Lecturer ID" value={form.lecturer_id} onChange={(e) => setForm({ ...form, lecturer_id: e.target.value })} className="border p-2 rounded" required />
        <input type="number" placeholder="Class ID" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} className="border p-2 rounded" required />
        <input type="number" placeholder="Week" value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} className="border p-2 rounded" required />
        <input type="date" placeholder="Date of Lecture" value={form.date_of_lecture} onChange={(e) => setForm({ ...form, date_of_lecture: e.target.value })} className="border p-2 rounded" required />
        <input type="text" placeholder="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="border p-2 rounded" required />

        <input type="text" placeholder="Learning Outcomes" value={form.learning_outcomes} onChange={(e) => setForm({ ...form, learning_outcomes: e.target.value })} className="border p-2 rounded" />
        <input type="text" placeholder="Recommendations" value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} className="border p-2 rounded" />
        <input type="number" placeholder="Actual Students" value={form.actual_students} onChange={(e) => setForm({ ...form, actual_students: e.target.value })} className="border p-2 rounded" />
        <input type="number" placeholder="Total Students" value={form.total_students} onChange={(e) => setForm({ ...form, total_students: e.target.value })} className="border p-2 rounded" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded col-span-1 sm:col-span-5 mt-2 sm:mt-0"><FaPlus /> Add Report</button>
      </form>

      <table className="w-full border bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Lecturer ID</th>
            <th className="border p-2">Class ID</th>
            <th className="border p-2">Week</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Topic</th>
            <th className="border p-2">Outcomes</th>
            <th className="border p-2">Recommendations</th>
            <th className="border p-2">Actual</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.lecturer_id}</td>
              <td className="border p-2">{r.class_id}</td>
              <td className="border p-2">{r.week}</td>
              <td className="border p-2">{r.date_of_lecture}</td>
              <td className="border p-2">{r.topic}</td>
              <td className="border p-2">{r.learning_outcomes}</td>
              <td className="border p-2">{r.recommendations}</td>
              <td className="border p-2">{r.actual_students}</td>
              <td className="border p-2">{r.total_students}</td>
              <td className="border p-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
