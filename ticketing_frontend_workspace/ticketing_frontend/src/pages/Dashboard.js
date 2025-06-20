import React, { useEffect, useState } from "react";
import { getDashboard } from "../api/client";

// PUBLIC_INTERFACE
export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboard().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h2 style={{ color: "#1976d2" }}>Dashboard Overview</h2>
      <div style={{
        display: "flex", gap: 28, marginTop: 33, flexWrap: "wrap"
      }}>
        {stats ? (
          <>
            <StatCard label="Total Tickets" value={stats.total_tickets} color="#1976d2" />
            <StatCard label="Open Tickets" value={stats.open_tickets} color="#ff9800" />
            <StatCard label="Closed Tickets" value={stats.closed_tickets} color="#424242" />
            <StatCard label="Assigned Tickets" value={stats.assigned_tickets} color="#32b58d" />
          </>
        ) : (
          [1,2,3,4].map(n => <StatCard key={n} loading label="-" value="-" />)
        )}
      </div>
      <div style={{marginTop:50}}>
        <div style={{fontSize:18}}>
          Welcome to the Ticketing System! Use the sidebar to manage your tickets.
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, loading }) {
  return (
    <div style={{
      minWidth: 170,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(25,118,210,0.085)",
      padding: "28px 30px",
      textAlign: "center"
    }}>
      <div style={{fontSize:18, color}}>{loading ? "..." : value}</div>
      <div style={{color:"#9099ab", marginTop: 7 }}>{label}</div>
    </div>
  );
}
