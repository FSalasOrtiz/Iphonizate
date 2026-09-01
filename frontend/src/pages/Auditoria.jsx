import React, { useState } from "react";
import { Search } from "lucide-react";
import { Card, Empty } from "../components/ui";
import { useApp } from "../context/AppContext";
import { fmtDateTime } from "../lib/helpers";
import { TIENDAS } from "../lib/constants";

export default function Auditoria() {
  const { data } = useApp();
  const [tienda, setTienda] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  const filtered = data.auditoria.filter(
    (a) =>
      (tienda === "Todas" || a.tienda === tienda) &&
      (busqueda === "" || a.detalle.toLowerCase().includes(busqueda.toLowerCase()) || a.accion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <>
      <h1 className="h1">Auditoría</h1>
      <div className="h1-sub">Registro de cambios de precio, stock y accesos. Los campos sensibles vienen filtrados desde la base de datos.</div>
      <Card>
        <div className="chip-row">
          <select className="select-inline" value={tienda} onChange={(e) => setTienda(e.target.value)}><option>Todas</option>{TIENDAS.map((t) => <option key={t}>{t}</option>)}</select>
          <div className="search-row" style={{ flex: 1, minWidth: 200 }}><Search size={16} /><input className="search-input" placeholder="IMEI, modelo, nombre…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
        </div>
        {filtered.length === 0 ? <Empty title="Sin registros con ese filtro." /> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Rol</th><th>Tienda</th><th>Acción</th><th>Resumen del cambio</th></tr></thead>
              <tbody>{filtered.map((a) => (<tr key={a.id}><td>{fmtDateTime(a.fecha)}</td><td>{a.usuario}</td><td>{a.rol}</td><td>{a.tienda}</td><td>{a.accion}</td><td>{a.detalle || "Sin detalle"}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
