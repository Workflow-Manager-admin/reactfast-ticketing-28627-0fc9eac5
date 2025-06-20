import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/client";

// PUBLIC_INTERFACE
export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      nav("/login");
    } catch (err) {
      setError("Registration failed: check all fields or try another username/email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 90 }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(255, 152, 0, 0.12)",
        padding: 38,
      }}>
        <h2 style={{ color: "#1976d2" }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input required placeholder="Username"
            style={inputStyle}
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            autoFocus
          />
          <input required type="email" placeholder="Email"
            style={inputStyle}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input placeholder="Full Name"
            style={inputStyle}
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />
          <input required type="password" placeholder="Password"
            style={inputStyle}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          {error && <div style={{ color: "#ff4639", fontWeight: 600 }}>{error}</div>}
          <button className="btn btn-large" disabled={busy} style={{ background: "#1976d2", color: "#fff", marginTop: 10 }}>
            {busy ? "Registering..." : "Register"}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 15 }}>
          Already have an account? <Link to="/login" style={{ color: "#1976d2" }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  fontSize: 16,
  padding: "10px 14px",
  border: "1.5px solid #1976d2",
  borderRadius: 6,
  outline: "none",
  marginBottom: 2,
};
