import React, { useEffect, useState } from "react";
import { fetchReports, addReport } from "./api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchReports();
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reports");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await addReport(form);
      setForm({ title: "", description: "" });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to add report");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `reports_${Date.now()}.xlsx`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Reports</h1>
        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded">Export Excel</button>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border p-2 rounded" required />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border p-2 rounded" required />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Add Report</button>
      </form>

      <ul className="space-y-3">
        {reports.map((r) => (
          <li key={r.id || r._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{r.title}</h3>
            <p className="text-sm text-gray-600">{r.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
