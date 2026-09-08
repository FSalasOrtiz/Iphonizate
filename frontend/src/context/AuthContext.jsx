import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiFetch, AUTH_KEY } from "../lib/api.js";

const AuthContext = createContext(null);

const TIMEOUT_KEY = "iphonizate-session-timeout";
const DEFAULT_TIMEOUT_MINUTES = 30; // 0 = nunca
const ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
const CHECK_INTERVAL_MS = 15000;

function readStoredToken() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

function readStoredTimeout() {
  try {
    const raw = window.localStorage.getItem(TIMEOUT_KEY);
    const n = raw === null ? DEFAULT_TIMEOUT_MINUTES : Number(raw);
    return Number.isFinite(n) ? n : DEFAULT_TIMEOUT_MINUTES;
  } catch {
    return DEFAULT_TIMEOUT_MINUTES;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutesState] = useState(readStoredTimeout);
  const lastActivityRef = useRef(Date.now());

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
      lastActivityRef.current = Date.now();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || "No se pudo iniciar sesión." };
    }
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setSession(null);
  };

  const setSessionTimeoutMinutes = (minutes) => {
    const n = Number(minutes) || 0;
    setSessionTimeoutMinutesState(n);
    window.localStorage.setItem(TIMEOUT_KEY, String(n));
  };

  // Cierre de sesión automático por inactividad. Solo corre mientras hay
  // sesión activa y el usuario no eligió "Nunca" (0).
  useEffect(() => {
    if (!session || !sessionTimeoutMinutes) return;

    const markActivity = () => {
      lastActivityRef.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, markActivity, { passive: true }));
    markActivity();

    const intervalId = setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs >= sessionTimeoutMinutes * 60 * 1000) {
        logout();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, markActivity));
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, sessionTimeoutMinutes]);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        login,
        logout,
        checking,
        sessionTimeoutMinutes,
        setSessionTimeoutMinutes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() debe usarse dentro de <AuthProvider>");
  return ctx;
}
