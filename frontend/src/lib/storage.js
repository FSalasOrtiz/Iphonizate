// Persistencia contra la API real (ver backend/). Reemplaza al antiguo
// localStorage: ahora los datos son compartidos entre dispositivos y
// requieren sesión.
import { apiFetch } from "./api.js";

export async function loadData() {
  try {
    const res = await apiFetch("/data");
    return res?.data ?? null;
  } catch (err) {
    console.error("No se pudo cargar la información del servidor:", err);
    return null;
  }
}

export async function saveData(data) {
  try {
    await apiFetch("/data", { method: "PUT", body: { data } });
    return true;
  } catch (err) {
    console.error("No se pudo guardar en el servidor:", err);
    return false;
  }
}
