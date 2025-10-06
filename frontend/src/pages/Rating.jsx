import React, { useEffect, useState } from "react";
import { fetchRatings, submitRating } from "./api";
import SearchBar from "../components/SearchBar";

export default function Rating() {
  const [ratings, setRatings] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ itemId: "", score: 5, comment: "" });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchRatings();
      setRatings(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await submitRating(form);
      setForm({ itemId: "", score: 5, comment: "" });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  };

  const filtered = ratings.filter(r => `${r.itemId} ${r.comment}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Ratings</h1>
      </div>

      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ratings..." />

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
        <input placeholder="Item ID" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} className="border p-2 rounded" required />
        <select value={form.score} onChange={(e) => setForm({ ...form, score: +e.target.value })} className="border p-2 rounded">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <input placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="border p-2 rounded" />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Submit</button>
      </form>

      <ul className="space-y-3">
        {filtered.map(r => (
          <li key={r.id || r._id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{r.itemId}</div>
                <div className="text-sm text-gray-600">{r.comment}</div>
              </div>
              <div className="text-yellow-500 font-bold">{r.score}★</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
