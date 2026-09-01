import React, { useState } from "react";
import { ScanLine, X } from "lucide-react";
import { Card, Empty, Badge } from "../components/ui";
import { useApp } from "../context/AppContext";
import { uid, fmtDateShort } from "../lib/helpers";

export default function Garantias() {
  const { data, patch, activeTienda, addAudit } = useApp();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(null);
  const [falla, setFalla] = useState("");
  const [resolviendo, setResolviendo] = useState(null);
  const [resolucion, setResolucion] = useState("");

  const vendidos = data.equipos.filter(
    (e) => (e.estado === "vendido" || e.estado === "entregado") &&
      (query === "" || e.imei.includes(query) || e.modelo.toLowerCase().includes(query.toLowerCase()))
  );

  const abiertas = data.garantias.filter((g) => g.estado === "abierta");
  const resueltas = data.garantias.filter((g) => g.estado === "resuelta");

  const ingresar = () => {
    if (!sel || !falla) return;
    const now = new Date();
    const sla = new Date(now.getTime() + 72 * 3600000);
    const g = { id: uid(), equipoId: sel.id, modelo: sel.modelo, imei: sel.imei, clienteNombre: sel.clienteNombre || "—", falla, fechaIngreso: now.toISOString(), slaFecha: sla.toISOString(), estado: "abierta", resolucion: "" };
    patch("garantias", (arr) => [g, ...arr]);
    patch("equipos", (arr) => arr.map((e) => (e.id === sel.id ? { ...e, estado: "garantia" } : e)));
    addAudit("Ingresó una garantía", `${sel.modelo} · ${sel.imei}`, activeTienda);
    setSel(null); setFalla(""); setQuery("");
  };

  const resolver = (tipo) => {
    if (!resolviendo) return;
    patch("garantias", (arr) => arr.map((g) => (g.id === resolviendo.id ? { ...g, estado: "resuelta", resolucion: `${tipo}: ${resolucion}` } : g)));
    patch("equipos", (arr) => arr.map((e) => (e.id === resolviendo.equipoId ? { ...e, estado: "vendido" } : e)));
    addAudit("Resolvió una garantía", `${resolviendo.modelo} · ${tipo}`, activeTienda);
    setResolviendo(null); setResolucion("");
  };

  return (
    <>
      <h1 className="h1">Garantías</h1>
      <div className="h1-sub">Solicitudes de garantía, SLA de 72 horas y resoluciones por reparación o cambio.</div>

      <Card title="Ingresar garantía" right={<Badge>Entra a {activeTienda}</Badge>}>
        <div className="search-row"><ScanLine size={16} /><input className="search-input" placeholder="Escanea el IMEI del equipo que trae el cliente" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        {query && !sel && (
          vendidos.length === 0 ? <Empty title="Aún no hay equipos vendidos." /> : (
            <div className="dropdown-list">
              {vendidos.map((e) => (
                <button key={e.id} className="dropdown-item" onClick={() => setSel(e)}>{e.modelo} · {e.imei}{e.clienteNombre ? ` · ${e.clienteNombre}` : ""}</button>
              ))}
            </div>
          )
        )}
        {sel && (
          <div className="inline-form" style={{ marginTop: 10 }}>
            <div className="selected-pill">{sel.modelo} — {sel.imei}<button className="btn-icon" onClick={() => setSel(null)}><X size={14} /></button></div>
            <textarea className="input" rows={2} placeholder="Descripción de la falla" value={falla} onChange={(e) => setFalla(e.target.value)} />
            <button className="btn btn-primary" disabled={!falla} onClick={ingresar}>Registrar garantía</button>
          </div>
        )}
      </Card>

      <Card title="Garantías abiertas" right={<Badge tone="yellow">{abiertas.length} en curso · SLA 72h</Badge>}>
        {abiertas.length === 0 ? <Empty title="No hay garantías abiertas ahora mismo." /> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Ingreso</th><th>Equipo</th><th>Cliente</th><th>Falla</th><th>SLA</th><th></th></tr></thead>
              <tbody>
                {abiertas.map((g) => {
                  const horas = Math.round((new Date(g.slaFecha) - new Date()) / 3600000);
                  return (
                    <tr key={g.id}>
                      <td>{fmtDateShort(g.fechaIngreso)}</td><td>{g.modelo} · {g.imei}</td><td>{g.clienteNombre}</td><td>{g.falla}</td>
                      <td><Badge tone={horas < 12 ? "red" : "yellow"}>{horas > 0 ? `${horas}h restantes` : "vencido"}</Badge></td>
                      <td>
                        {resolviendo?.id === g.id ? (
                          <div className="inline-form">
                            <input className="input" placeholder="Detalle de la resolución" value={resolucion} onChange={(e) => setResolucion(e.target.value)} />
                            <button className="btn btn-secondary" onClick={() => resolver("Reparación")}>Reparación</button>
                            <button className="btn btn-secondary" onClick={() => resolver("Cambio")}>Cambio</button>
                          </div>
                        ) : (
                          <button className="btn btn-secondary" onClick={() => setResolviendo(g)}>Resolver</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Historial de garantías resueltas" right={<Badge>{resueltas.length} casos</Badge>}>
        {resueltas.length === 0 ? <Empty title="Todavía no hay garantías resueltas." /> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Ingreso</th><th>Equipo</th><th>Cliente</th><th>Falla</th><th>Resolución</th></tr></thead>
              <tbody>
                {resueltas.map((g) => (
                  <tr key={g.id}><td>{fmtDateShort(g.fechaIngreso)}</td><td>{g.modelo} · {g.imei}</td><td>{g.clienteNombre}</td><td>{g.falla}</td><td>{g.resolucion}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
