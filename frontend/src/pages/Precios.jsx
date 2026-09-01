import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card, Empty, Chip } from "../components/ui";
import { useApp } from "../context/AppContext";
import { uid, fmtMoney, fmtDateShort } from "../lib/helpers";

export default function Precios() {
  const { data, patch, addAudit } = useApp();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("modelo");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ modelo: "", gb: "", precioSugerido: 0 });

  const filtered = data.precios
    .filter((p) => query === "" || p.modelo.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sortBy === "modelo" ? a.modelo.localeCompare(b.modelo) : new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)));

  const agregar = () => {
    if (!form.modelo) return;
    const p = { id: uid(), ...form, gb: String(form.gb), precioSugerido: Number(form.precioSugerido), fechaActualizacion: new Date().toISOString(), actualizado: "Renato" };
    patch("precios", (arr) => [p, ...arr]);
    addAudit("Actualizó precio sugerido", `${form.modelo} ${form.gb}GB → ${fmtMoney(form.precioSugerido)}`);
    setForm({ modelo: "", gb: "", precioSugerido: 0 });
    setShowForm(false);
  };

  return (
    <>
      <h1 className="h1">Precios</h1>
      <div className="h1-sub">Precios sugeridos por modelo y capacidad, con control de actualización.</div>
      <Card right={<button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}><Plus size={14} /> Nuevo precio</button>}>
        {showForm && (
          <div className="inline-form-grid">
            <input className="input" placeholder="Modelo" value={form.modelo} onChange={(e) => setForm((f) => ({ ...f, modelo: e.target.value }))} />
            <input className="input" placeholder="GB" value={form.gb} onChange={(e) => setForm((f) => ({ ...f, gb: e.target.value }))} />
            <input className="input" type="number" placeholder="Precio sugerido" value={form.precioSugerido} onChange={(e) => setForm((f) => ({ ...f, precioSugerido: e.target.value }))} />
            <button className="btn btn-primary" onClick={agregar}>Guardar</button>
          </div>
        )}
        <div className="search-row"><Search size={16} /><input className="search-input" placeholder="Buscar por modelo" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <div className="chip-row">
          <Chip active={sortBy === "modelo"} onClick={() => setSortBy("modelo")}>Por modelo</Chip>
          <Chip active={sortBy === "actualizacion"} onClick={() => setSortBy("actualizacion")}>Por actualización</Chip>
        </div>
        <div className="table-caption">LISTA DE PRECIOS · {filtered.length} modelos</div>
        {filtered.length === 0 ? <Empty title="Todavía no hay precios cargados." /> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Modelo</th><th>GB</th><th>Precio sugerido</th><th>Última actualización</th><th>Actualizado</th></tr></thead>
              <tbody>{filtered.map((p) => (<tr key={p.id}><td>{p.modelo}</td><td>{p.gb}</td><td>{fmtMoney(p.precioSugerido)}</td><td>{fmtDateShort(p.fechaActualizacion)}</td><td>{p.actualizado}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
