import React, { useEffect, useState } from "react";
import { fetchMonitoring } from "./api";
import SearchBar from "../components/SearchBar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Monitoring() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    load();
    const id = setInterval(load, 5000); // refresh every 5s
    return () => clearInterval(id);
  }, []);

  const load = async () => {
    try {
      const res = await fetchMonitoring();
      setRows(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monitoring");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `monitoring_${Date.now()}.xlsx`);
  };

  const filtered = rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Monitoring</h1>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded">Export Excel</button>
        </div>
      </div>

      <SearchBar value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter monitoring entries..." />

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              {rows[0] && Object.keys(rows[0]).slice(0,6).map((h) => (<th key={h} className="p-2 text-left text-sm">{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                {Object.values(r).slice(0,6).map((v, j) => <td key={j} className="p-2 text-sm">{String(v)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
