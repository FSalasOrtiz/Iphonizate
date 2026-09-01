import React, { useState } from "react";
import { Search, Users } from "lucide-react";
import { Card, Empty, Badge } from "../components/ui";
import { useApp } from "../context/AppContext";
import { fmtMoney, fmtDateShort } from "../lib/helpers";

export default function Clientes() {
  const { data } = useApp();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);

  const list = data.clientes.filter((c) => query === "" || c.nombre.toLowerCase().includes(query.toLowerCase()) || c.telefono.includes(query));

  return (
    <>
      <h1 className="h1">Clientes</h1>
      <div className="h1-sub">Historial de compras, garantías y contacto.</div>
      <Card>
        <div className="search-row"><Search size={16} /><input className="search-input" placeholder="Buscar por nombre o teléfono" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        {list.length === 0 ? (
          <Empty icon={Users} title="Todavía no hay clientes registrados." subtitle="Aparecen automáticamente cuando registras una venta o reserva con cliente." />
        ) : (
          <div className="client-list">
            {list.map((c) => {
              const ventas = data.ventas.filter((v) => v.clienteId === c.id);
              const isOpen = expanded === c.id;
              return (
                <div key={c.id} className="client-row">
                  <button className="client-row-head" onClick={() => setExpanded(isOpen ? null : c.id)}>
                    <div>
                      <div className="client-name">{c.nombre}</div>
                      <div className="client-phone">{c.telefono || "Sin teléfono"}</div>
                    </div>
                    <Badge>{ventas.length} compras</Badge>
                  </button>
                  {isOpen && (
                    <div className="client-detail">
                      {ventas.length === 0 ? <div className="empty-inline">Sin compras registradas.</div> : (
                        <table className="table">
                          <thead><tr><th>Fecha</th><th>Tienda</th><th>Equipos</th><th>Total</th></tr></thead>
                          <tbody>{ventas.map((v) => (<tr key={v.id}><td>{fmtDateShort(v.fecha)}</td><td>{v.tienda}</td><td>{v.equipoIds.length}</td><td>{fmtMoney(v.total)}</td></tr>))}</tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
