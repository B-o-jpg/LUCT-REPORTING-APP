import React, { useEffect, useState } from "react";
import { fetchClasses, addClass } from "./api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", course_id: "" });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchClasses();
      setClasses(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch classes");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await addClass(form);
      setForm({ name: "", course_id: "" });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to add class");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(classes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classes");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `classes_${Date.now()}.xlsx`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Classes</h1>
        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded">Export Excel</button>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Class name" className="border p-2 rounded" required />
        <input value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} placeholder="Course ID" className="border p-2 rounded" required />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Add Class</button>
      </form>

      <ul className="space-y-3">
        {classes.map((c) => (
          <li key={c.id || c._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-600">Course ID: {c.course_id}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
