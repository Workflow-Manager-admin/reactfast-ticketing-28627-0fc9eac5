import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar" style={{ background: "var(--primary, #1976d2)", color: "#fff", minHeight: 64 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
        <div style={{display: "flex", alignItems: "center"}}>
          <span style={{ color: "var(--accent, #ff9800)", fontWeight: 800, fontSize: 22, marginRight: 12 }}>*</span>
          <span style={{ fontWeight: 700, letterSpacing: 2, fontSize: 20 }}>Ticketing App</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link to="/" style={{color: "#fff", fontWeight: 500, textDecoration: "none"}}>Dashboard</Link>
          {isAuthenticated && (
            <>
              <Link to="/tickets" style={{color: "#fff", fontWeight: 500, textDecoration: "none"}}>Tickets</Link>
              <Link to="/profile" style={{color: "#fff", fontWeight: 500, textDecoration: "none"}}>Profile</Link>
            </>
          )}
          {!isAuthenticated && <Link to="/login" className="btn" style={{ background: "#fff", color: "#1976d2", fontWeight: 600, borderRadius: 6 }}>Sign In</Link>}
          {isAuthenticated && (
            <button className="btn" style={{ background: "#ff9800", color: "#fff" }} onClick={logout}>
              Logout {user?.username && `(${user.username})`}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
