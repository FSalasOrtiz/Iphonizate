import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, AUTH_KEY } from "../lib/api.js";

const AuthContext = createContext(null);

function readStoredToken() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  // Al cargar la app, si hay un token guardado, lo valida contra el
  // servidor para no obligar a hacer login de nuevo en cada refresh.
  useEffect(() => {
    (async () => {
      const token = readStoredToken();
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await apiFetch("/auth/me");
        setSession({ ...res.user, token });
      } catch {
        window.localStorage.removeItem(AUTH_KEY);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const login = async (usuario, pin) => {
    try {
      const res = await apiFetch("/auth/login", { method: "POST", body: { usuario, pin } });
      window.localStorage.setItem(AUTH_KEY, JSON.stringify({ token: res.token }));
      setSession({ ...res.user, token: res.token });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || "No se pudo iniciar sesión." };
    }
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, login, logout, checking }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() debe usarse dentro de <AuthProvider>");
  return ctx;
}
