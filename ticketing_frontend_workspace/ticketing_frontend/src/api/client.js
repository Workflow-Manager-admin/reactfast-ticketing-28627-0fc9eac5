//
// PUBLIC_INTERFACE
// Minimal API client for Ticketing Backend (handles auth, refresh, and endpoints)
// Color palette: primary: #1976d2, accent: #ff9800, secondary: #424242

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

let accessToken = localStorage.getItem("access_token") || null;

// PUBLIC_INTERFACE
export function setAccessToken(token) {
  accessToken = token;
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}

// PUBLIC_INTERFACE
export function getAccessToken() {
  return accessToken;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", data = null, auth = false, query = {} } = {}) {
  // Compose query string
  let url = API_BASE + path;
  if (query && Object.keys(query).length) {
    const q = new URLSearchParams(query).toString();
    url += (url.includes("?") ? "&" : "?") + q;
  }
  const headers = {
    "Content-Type": "application/json",
  };
  if (auth && accessToken) {
    headers["Authorization"] = "Bearer " + accessToken;
  }
  const config = {
    method,
    headers,
  };
  if (data !== null) {
    config.body = JSON.stringify(data);
  }
  const resp = await fetch(url, config);
  // handle 401 for auth flow
  if (resp.status === 401) {
    setAccessToken(null);
    throw new Error("Unauthorized");
  }
  if (resp.status === 204) return null; // No Content
  const contentType = resp.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await resp.json();
  } else {
    return await resp.text();
  }
}

// AUTH API

// PUBLIC_INTERFACE
export async function login(username, password) {
  const body = new URLSearchParams({
    username,
    password,
    grant_type: "password"
  });
  const resp = await fetch(API_BASE + "/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (resp.status !== 200) throw new Error("Login failed");
  const { access_token } = await resp.json();
  setAccessToken(access_token);
  return access_token;
}

// PUBLIC_INTERFACE
export async function register({ username, email, full_name, password }) {
  const resp = await fetch(API_BASE + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, full_name, password }),
  });
  if (resp.status !== 200) throw new Error("Registration failed");
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function getMe() {
  return apiRequest("/auth/me", { auth: true, query: { local_kw: "1" } });
}

// PUBLIC_INTERFACE
export async function getProfile() {
  return apiRequest("/users/me", { auth: true, query: { local_kw: "1" } });
}

// PUBLIC_INTERFACE
export async function updateProfile(profile) {
  return apiRequest("/users/me", { method: "PUT", auth: true, query: { local_kw: "1" }, data: profile });
}

// DASHBOARD API

// PUBLIC_INTERFACE
export async function getDashboard() {
  return apiRequest("/dashboard/", { auth: true, query: { local_kw: "1" } });
}

// TICKETS API

// PUBLIC_INTERFACE
export async function listTickets() {
  return apiRequest("/tickets/", { auth: true, query: { local_kw: "1" } });
}

// PUBLIC_INTERFACE
export async function createTicket(ticket) {
  return apiRequest("/tickets/", { method: "POST", auth: true, query: { local_kw: "1" }, data: ticket });
}

// PUBLIC_INTERFACE
export async function getTicket(ticketId) {
  return apiRequest(`/tickets/${ticketId}`, { auth: true, query: { local_kw: "1" } });
}

// PUBLIC_INTERFACE
export async function updateTicket(ticketId, ticket) {
  return apiRequest(`/tickets/${ticketId}`, { method: "PUT", auth: true, query: { local_kw: "1" }, data: ticket });
}

// PUBLIC_INTERFACE
export async function deleteTicket(ticketId) {
  return apiRequest(`/tickets/${ticketId}`, { method: "DELETE", auth: true, query: { local_kw: "1" } });
}
