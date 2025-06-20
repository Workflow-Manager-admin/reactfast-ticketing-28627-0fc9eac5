import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f7fafd" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{
          marginLeft: window.innerWidth < 750 ? 0 : 220,
          padding: 32,
          width: "100%",
          background: "#f7fafd",
          minHeight: "calc(100vh - 64px)",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
