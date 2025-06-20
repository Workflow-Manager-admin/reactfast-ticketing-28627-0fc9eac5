import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  setAccessToken,
  getMe,
  login as apiLogin,
  logout as apiLogout,
} from "./client";

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getAccessToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const u = await getMe();
        setUser(u);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  // PUBLIC_INTERFACE
  async function login(username, password) {
    const t = await apiLogin(username, password);
    setTokenState(t);
    setUser(await getMe());
  }

  // PUBLIC_INTERFACE
  function logout() {
    setAccessToken(null);
    setUser(null);
    setTokenState(null);
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    loading,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
