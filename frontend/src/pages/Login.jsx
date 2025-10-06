import React, { useState } from "react";
import { login } from "./api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      // simple example: store token if returned
      if (res.data?.token) localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" className="border p-2 rounded w-full"/>
        <input required type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Password" className="border p-2 rounded w-full"/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
