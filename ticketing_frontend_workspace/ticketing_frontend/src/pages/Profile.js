import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/client";
import { useAuth } from "../api/AuthContext";

// PUBLIC_INTERFACE
export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({});
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getProfile().then(p => {
      setForm({
        email: p.email || "",
        full_name: p.full_name || "",
        password: "",
      });
    }).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const update = { ...form };
      if (!update.password) delete update.password;
      const p = await updateProfile(update);
      setUser(p);
      setInfo("Profile updated!");
    } catch {
      setError("Profile update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      background:"#fff",maxWidth:420,padding:38,margin:"0 auto",borderRadius:12,marginTop:32,
      boxShadow:"0 4px 16px #1976d256"
    }}>
      <h2 style={{ color: "#1976d2" }}>My Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label>Email</label><br/>
          <input required type="email" value={form.email || ""} style={inputStyle}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label>Full Name</label><br/>
          <input value={form.full_name || ""} style={inputStyle}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />
        </div>
        <div>
          <label>Change Password</label><br/>
          <input type="password" placeholder="New password..." style={inputStyle}
            value={form.password || ""}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {info && <div style={{color:"#1976d2",marginBottom:4}}>{info}</div>}
        {error && <div style={{color:"#f33",marginBottom:4}}>{error}</div>}
        <button className="btn btn-large" disabled={busy} style={{ background: "#1976d2", color: "#fff" }}>
          {busy ? "Saving..." : "Save Profile"}
        </button>
      </form>
      <div style={{marginTop:12,color:"#888",fontSize:13}}>
        Username: <b>{user?.username}</b> &nbsp;| &nbsp; Registered: <b>{user?.created_at?.substring(0,10)}</b>
      </div>
    </div>
  );
}
const inputStyle = {
  fontSize: 16,
  padding: "9px 11px",
  border: "1.3px solid #1976d2",
  borderRadius: 6,
  outline: "none",
  width: "100%"
};
