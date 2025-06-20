import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

// Basic responsive sidebar with theme colors
export default function Sidebar() {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="sidebar"
      style={{
        width: 220,
        background: "var(--secondary, #424242)",
        minHeight: "100vh",
        paddingTop: 24,
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 64,
        display: window.innerWidth < 750 ? "none" : "block",
        transition: "width 0.2s",
        zIndex: 80,
      }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 16, paddingLeft: 24 }}>
        <NavLink to="/" style={({ isActive }) => navStyle(isActive)}>Dashboard</NavLink>
        {isAuthenticated && <>
          <NavLink to="/tickets" style={({ isActive }) => navStyle(isActive)}>My Tickets</NavLink>
          <NavLink to="/profile" style={({ isActive }) => navStyle(isActive)}>Profile</NavLink>
        </>}
      </nav>
    </aside>
  );
}

function navStyle(isActive) {
  return {
    color: isActive ? "var(--accent, #ff9800)" : "#fff",
    fontWeight: isActive ? 700 : 500,
    background: isActive ? "rgba(25, 118, 210, 0.08)" : "inherit",
    borderRadius: 6,
    padding: "6px 12px",
    textDecoration: "none",
  };
}
