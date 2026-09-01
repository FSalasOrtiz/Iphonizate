import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, Empty, Chip } from "../components/ui";
import { useApp } from "../context/AppContext";
import { uid, fmtMoney } from "../lib/helpers";
import { CATEGORIAS_ACCESORIO, TIENDAS } from "../lib/constants";

export default function Accesorios() {
  const { data, patch, addAudit } = useApp();
  const [cat, setCat] = useState("Todas");
  const [tienda, setTienda] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", categoria: CATEGORIAS_ACCESORIO[0], modelo: "", costo: 0, precio: 0 });

  const filtered = data.accesorios.filter((a) => cat === "Todas" || a.categoria === cat);

  const agregar = () => {
    if (!form.nombre) return;
    const a = { id: uid(), ...form, costo: Number(form.costo), precio: Number(form.precio), stock: Object.fromEntries(TIENDAS.map((t) => [t, 0])) };
    patch("accesorios", (arr) => [a, ...arr]);
    addAudit("Creó un accesorio", form.nombre);
    setForm({ nombre: "", categoria: CATEGORIAS_ACCESORIO[0], modelo: "", costo: 0, precio: 0 });
    setShowForm(false);
  };

  const ajustar = (id, t, val) => {
    patch("accesorios", (arr) => arr.map((a) => (a.id === id ? { ...a, stock: { ...a.stock, [t]: Math.max(0, Number(val) || 0) } } : a)));
  };

  return (
    <>
      <h1 className="h1">Accesorios</h1>
      <div className="h1-sub">Catálogo de accesorios con stock por tienda, mínimos y ajustes registrados.</div>
      <Card right={<button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}><Plus size={14} /> Nuevo accesorio</button>}>
        {showForm && (
          <div className="inline-form-grid">
            <input className="input" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
            <select className="select" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}>
              {CATEGORIAS_ACCESORIO.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input className="input" placeholder="Modelo compatible" value={form.modelo} onChange={(e) => setForm((f) => ({ ...f, modelo: e.target.value }))} />
            <input className="input" type="number" placeholder="Costo" value={form.costo} onChange={(e) => setForm((f) => ({ ...f, costo: e.target.value }))} />
            <input className="input" type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} />
            <button className="btn btn-primary" onClick={agregar}>Guardar</button>
          </div>
        )}
        <div className="chip-row">
          <span className="field-label">CATEGORÍA</span>
          <Chip active={cat === "Todas"} onClick={() => setCat("Todas")}>Todas</Chip>
          {CATEGORIAS_ACCESORIO.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>
        <div className="chip-row">
          <span className="field-label">TIENDA</span>
          <Chip active={tienda === "Todas"} onClick={() => setTienda("Todas")}>Todas</Chip>
          {TIENDAS.map((t) => <Chip key={t} active={tienda === t} onClick={() => setTienda(t)}>{t}</Chip>)}
        </div>

        {filtered.length === 0 ? (
          <Empty title="Todavía no hay accesorios con ese filtro." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Nombre</th><th>Categoría</th><th>Modelo</th><th>Costo</th><th>Precio</th>
                  {(tienda === "Todas" ? TIENDAS : [tienda]).map((t) => <th key={t}>{t}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre}</td><td>{a.categoria}</td><td>{a.modelo}</td><td>{fmtMoney(a.costo)}</td><td>{fmtMoney(a.precio)}</td>
                    {(tienda === "Todas" ? TIENDAS : [tienda]).map((t) => (
                      <td key={t}>
                        <input className="input-mini" type="number" value={a.stock[t] || 0} onChange={(e) => ajustar(a.id, t, e.target.value)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
