import React, { useState } from "react";
import { register } from "./api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered — you can now login");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Full name" className="border p-2 rounded w-full"/>
        <input required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" className="border p-2 rounded w-full"/>
        <input required type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Password" className="border p-2 rounded w-full"/>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
