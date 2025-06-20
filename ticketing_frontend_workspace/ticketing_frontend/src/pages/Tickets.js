import React, { useEffect, useState } from "react";
import {
  listTickets, createTicket, updateTicket, deleteTicket, getTicket
} from "../api/client";

// PUBLIC_INTERFACE
export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [modal, setModal] = useState(null); // {mode: "create"/"edit"/"view", ticket: {}}
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Fetch all tickets
  async function refresh() {
    try {
      setBusy(true);
      const all = await listTickets();
      setTickets(all || []);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this ticket permanently?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteTicket(id);
      setModal(null);
      refresh();
    } catch {
      setError("Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  function openModal(mode, ticket) {
    setModal({ mode, ticket: ticket || {} });
  }
  function closeModal() { setModal(null); }

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h2 style={{ color: "#1976d2" }}>My Tickets</h2>
        <button className="btn" style={{background:"#1976d2",color:"#fff"}} onClick={() => openModal("create")}>+ Create Ticket</button>
      </div>
      <table style={{marginTop:26, background:"#fff",width:"100%",borderRadius:10,boxShadow:"0 1px 10px #bbb1",overflow:"hidden"}}>
        <thead style={{background:"#f2f2f8",fontWeight:600}}>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Priority</th>
            <th style={thStyle}>Created</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id} style={{borderBottom:"1px solid #e7eaf0"}}>
              <td style={tdStyle}>{ticket.title}</td>
              <td style={tdStyle}>{ticket.status}</td>
              <td style={tdStyle}>{ticket.priority || "normal"}</td>
              <td style={tdStyle}>{formatDate(ticket.created_at)}</td>
              <td style={tdStyle}>
                <button className="btn" style={smallBtn} onClick={() => openModal("view", ticket)}>View</button>{" "}
                <button className="btn" style={{...smallBtn,background:"#ff9800"}} onClick={() => openModal("edit", ticket)}>Edit</button>{" "}
                <button className="btn" style={{...smallBtn,background:"#ff3934"}} onClick={() => handleDelete(ticket.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && <TicketModal modal={modal} close={closeModal} refresh={refresh} setError={setError} />}
      {error && <div style={{ color: "#ff3934", marginTop: 16, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleString();
}

const thStyle = { textAlign:"left", padding:"10px 16px", background:"#f2f2f8" };
const tdStyle = { padding:"10px 16px", background:"#fff" };
const smallBtn = { padding:"5px 10px", fontSize:14, marginRight:2, borderRadius:5, background:"#1976d2", color:"#fff", border:"none", fontWeight:500 };

function TicketModal({ modal, close, refresh, setError }) {
  const [form, setForm] = useState(modal.ticket || {});
  const [busy, setBusy] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (modal.mode === "create") {
        await createTicket(form);
      } else if (modal.mode === "edit") {
        await updateTicket(modal.ticket.id, form);
      }
      close();
      refresh();
    } catch {
      setError("Save failed. Please check the data.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      position:"fixed", left:0,top:0,right:0,bottom:0,zIndex:120,background:"rgba(0,0,0,0.22)",
      display:"flex",alignItems:"center",justifyContent:"center"
    }}>
      <div style={{
        background:"#fff",borderRadius:14,minWidth:360,maxWidth:500,minHeight:220,boxShadow:"0 8px 28px #1976d244",padding:32,
        position:"relative"
      }}>
        <button onClick={close} style={{position:"absolute",right:16,top:12,background:"none",fontSize:24,color:"#1976d2",border:"none"}}>&times;</button>
        <h3 style={{color:"#1976d2"}}>{modal.mode === "create" ? "New Ticket" : modal.mode === "edit" ? "Edit Ticket" : "Ticket Details"}</h3>
        {(modal.mode === "view") ?
          <TicketView ticket={modal.ticket} /> :
          <form onSubmit={handleSave} style={{ display:"flex",flexDirection:"column",gap:14,marginTop:16 }}>
            <input required placeholder="Title"
              style={inputStyle}
              value={form.title || ""}
              onChange={e => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
            <textarea placeholder="Description"
              style={{...inputStyle,minHeight:60}}
              value={form.description || ""}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <div style={{ display: "flex", gap: 16 }}>
              <select style={{ ...inputStyle, flex: 1 }} value={form.status || "open"}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <select style={{ ...inputStyle, flex: 1 }} value={form.priority || "normal"}
                onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <button className="btn btn-large" disabled={busy} style={{ background: "#1976d2", color: "#fff", marginTop: 10 }}>
              {busy ? "Saving..." : "Save"}
            </button>
          </form>
        }
        {(modal.mode !== "create" && modal.mode !== "edit") && <button className="btn" style={{ marginTop: 16 }} onClick={close}>Close</button>}
      </div>
    </div>
  );
}

function TicketView({ ticket }) {
  return (
    <div style={{ fontSize: 16, lineHeight: 1.6, marginTop: 10 }}>
      <strong>Title:</strong> {ticket.title} <br />
      <strong>Description:</strong> {ticket.description || "-"} <br />
      <strong>Status:</strong> {ticket.status} <br />
      <strong>Priority:</strong> {ticket.priority || "normal"} <br />
      <strong>Created:</strong> {formatDate(ticket.created_at)} <br />
      <strong>Updated:</strong> {formatDate(ticket.updated_at)} <br />
      <strong>Owner:</strong> {ticket.owner_id}
    </div>
  );
}

const inputStyle = {
  fontSize: 16,
  padding: "10px 10px",
  border: "1.3px solid #1976d2",
  borderRadius: 5,
  outline: "none",
};
