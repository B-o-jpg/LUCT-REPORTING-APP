import React, { useEffect, useState } from "react";
import { fetchLecturers } from "./api";
import SearchBar from "../components/SearchBar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Lecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchLecturers();
      setLecturers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch lecturers");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(lecturers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lecturers");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `lecturers_${Date.now()}.xlsx`);
  };

  const filtered = lecturers.filter(l => `${l.name} ${l.department}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Lecturers</h1>
        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded">Export Excel</button>
      </div>

      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lecturers..." />

      <ul className="space-y-3">
        {filtered.map((l) => (
          <li key={l.id || l._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{l.name}</h3>
                <p className="text-sm text-gray-600">{l.department}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
