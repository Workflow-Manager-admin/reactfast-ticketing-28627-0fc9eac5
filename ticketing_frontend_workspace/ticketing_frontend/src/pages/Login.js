import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

// PUBLIC_INTERFACE
export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.username, form.password);
      nav("/");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 380, marginTop: 90 }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
        padding: 34,
      }}>
        <h2 style={{ color: "#1976d2" }}>Sign In</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input required placeholder="Username"
            style={inputStyle}
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            autoFocus
          />
          <input required type="password" placeholder="Password"
            style={inputStyle}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          {error && <div style={{ color: "#ff4639", fontWeight: 600 }}>{error}</div>}
          <button className="btn btn-large" disabled={busy} style={{
            background: "#1976d2", color: "#fff", marginTop: 10
          }}>
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 15 }}>
          Don&apos;t have an account? <Link to="/register" style={{ color: "#1976d2" }}>Register</Link>
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
