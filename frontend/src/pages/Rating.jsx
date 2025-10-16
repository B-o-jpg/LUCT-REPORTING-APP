import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Rating() {
  const [ratings, setRatings] = useState([]);
  const [query, setQuery] = useState("");
  const [forms, setForms] = useState([
    { lecturer_id: "", rating_value: 5, comments: "", student_id: "" },
  ]);

  // Fetch ratings
  const loadRatings = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/rating");
      setRatings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
    }
  };

  useEffect(() => {
    loadRatings();
  }, []);

  // Add new rating form
  const addForm = () => {
    setForms([...forms, { lecturer_id: "", rating_value: 5, comments: "", student_id: "" }]);
  };

  // Remove a rating form
  const removeForm = (index) => {
    setForms(forms.filter((_, i) => i !== index));
  };

  // Update a rating form
  const updateForm = (index, field, value) => {
    const newForms = [...forms];
    newForms[index][field] = value;
    setForms(newForms);
  };

  // Submit all ratings
  const submitAll = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(forms.map(f => axios.post("http://localhost:4000/api/rating", f)));
      setForms([{ lecturer_id: "", rating_value: 5, comments: "", student_id: "" }]);
      loadRatings();
    } catch (err) {
      console.error(err);
      alert("Failed to submit ratings");
    }
  };

  // Export to Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ratings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ratings");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), `ratings_${Date.now()}.xlsx`);
  };

  // Filter for search
  const filtered = ratings.filter(r =>
    `${r.lecturer_name} ${r.comments}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Ratings</h1>
        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-2 rounded">
          Export Excel
        </button>
      </div>

      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ratings..." />

      <form onSubmit={submitAll} className="space-y-3 mb-4">
        {forms.map((form, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
            <input
              placeholder="Lecturer ID"
              value={form.lecturer_id}
              onChange={(e) => updateForm(index, "lecturer_id", e.target.value)}
              className="border p-2 rounded"
              required
            />
            <select
              value={form.rating_value}
              onChange={(e) => updateForm(index, "rating_value", +e.target.value)}
              className="border p-2 rounded"
            >
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <input
              placeholder="Comments"
              value={form.comments}
              onChange={(e) => updateForm(index, "comments", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="Student ID"
              value={form.student_id}
              onChange={(e) => updateForm(index, "student_id", e.target.value)}
              className="border p-2 rounded"
              required
            />
            <button
              type="button"
              onClick={() => removeForm(index)}
              className="bg-red-600 text-white px-3 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={addForm} className="bg-gray-600 text-white px-3 py-2 rounded">
            Add More
          </button>
          <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">
            Submit All
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {filtered.map(r => (
          <li key={r.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.lecturer_name}</div>
              <div className="text-sm text-gray-600">{r.comments}</div>
            </div>
            <div className="text-yellow-500 font-bold">{r.rating_value}★</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
