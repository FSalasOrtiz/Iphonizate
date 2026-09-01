const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const AUTH_KEY = "iphonizate-auth";

function getToken() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // respuesta sin body (ej. 204)
  }

  if (!res.ok) {
    const message = payload?.error || `Error ${res.status} al conectar con el servidor.`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return payload;
}

export { AUTH_KEY };
