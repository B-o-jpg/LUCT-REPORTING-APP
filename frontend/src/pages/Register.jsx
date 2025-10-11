import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";

export default function Rating() {
  const [ratings, setRatings] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ lecturer_id: "", rating_value: 5, comments: "" });

  // Fetch all ratings from backend
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
    const interval = setInterval(loadRatings, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Submit a new rating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lecturer_id) return alert("Select a lecturer");
    try {
      await axios.post("http://localhost:4000/api/rating", form);
      setForm({ lecturer_id: "", rating_value: 5, comments: "" });
      loadRatings();
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  };

  // Filter ratings for search
  const filtered = ratings.filter((r) =>
    r.lecturer_name.toLowerCase().includes(query.toLowerCase()) ||
    (r.comments && r.comments.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Lecturer Ratings</h1>
      </div>

      {/* Search Bar */}
      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ratings..." />

      {/* Rating Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-2 my-4">
        <select
          value={form.lecturer_id}
          onChange={(e) => setForm({ ...form, lecturer_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Lecturer</option>
          {ratings.map((r) => (
            <option key={r.lecturer_id} value={r.lecturer_id}>
              {r.lecturer_name}
            </option>
          ))}
        </select>

        <select
          value={form.rating_value}
          onChange={(e) => setForm({ ...form, rating_value: +e.target.value })}
          className="border p-2 rounded"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n}★</option>
          ))}
        </select>

        <input
          placeholder="Comments"
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-3 py-2 rounded">Submit</button>
      </form>

      {/* Ratings List */}
      <ul className="space-y-3">
        {filtered.map((r) => (
          <li key={r.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold text-blue-700">{r.lecturer_name}</div>
              <div className="text-gray-600 text-sm">{r.comments}</div>
              <div className="text-gray-400 text-xs">Date: {new Date(r.date_rated).toLocaleDateString()}</div>
            </div>
            <div className="text-yellow-500 font-bold text-xl">{r.rating_value}★</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
