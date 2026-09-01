import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, Empty, StatCard } from "../components/ui";
import { useApp } from "../context/AppContext";
import { uid, fmtMoney, fmtDateShort, todayISO } from "../lib/helpers";
import { CATEGORIAS_GASTO, TIENDAS } from "../lib/constants";

export default function Gastos() {
  const { data, patch, addAudit } = useApp();
  const [cat, setCat] = useState("Todas");
  const [tienda, setTienda] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ categoria: CATEGORIAS_GASTO[0], descripcion: "", monto: 0, tienda: TIENDAS[0], fecha: todayISO() });

  const filtered = data.gastos.filter((g) => (cat === "Todas" || g.categoria === cat) && (tienda === "Todas" || g.tienda === tienda));
  const total = filtered.reduce((s, g) => s + g.monto, 0);
  const porCategoria = CATEGORIAS_GASTO.map((c) => ({ c, total: filtered.filter((g) => g.categoria === c).reduce((s, g) => s + g.monto, 0) })).filter((x) => x.total > 0);

  const agregar = () => {
    if (!form.descripcion || !form.monto) return;
    const g = { id: uid(), ...form, monto: Number(form.monto) };
    patch("gastos", (arr) => [g, ...arr]);
    addAudit("Registró un gasto", `${form.categoria} · ${fmtMoney(form.monto)}`, form.tienda);
    setForm({ categoria: CATEGORIAS_GASTO[0], descripcion: "", monto: 0, tienda: TIENDAS[0], fecha: todayISO() });
    setShowForm(false);
  };

  return (
    <>
      <h1 className="h1">Gastos</h1>
      <div className="h1-sub">Arriendos, remuneraciones, publicidad y gastos operativos por tienda.</div>
      <Card right={<button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}><Plus size={14} /> Nuevo gasto</button>}>
        {showForm && (
          <div className="inline-form-grid">
            <select className="select" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}>{CATEGORIAS_GASTO.map((c) => <option key={c}>{c}</option>)}</select>
            <input className="input" placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
            <input className="input" type="number" placeholder="Monto" value={form.monto} onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))} />
            <select className="select" value={form.tienda} onChange={(e) => setForm((f) => ({ ...f, tienda: e.target.value }))}>{TIENDAS.map((t) => <option key={t}>{t}</option>)}</select>
            <input className="input" type="date" value={form.fecha} onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} />
            <button className="btn btn-primary" onClick={agregar}>Guardar</button>
          </div>
        )}
        <div className="stat-grid stat-grid-2">
          <StatCard label="TOTAL DEL PERÍODO" value={fmtMoney(total)} sub={`${filtered.length} gastos`} />
          <div className="stat">
            <div className="stat-label">DESGLOSE POR CATEGORÍA</div>
            {porCategoria.length === 0 ? <div className="stat-sub">Sin gastos en el período filtrado</div> : (
              porCategoria.map((x) => <div key={x.c} className="progress-row"><span>{x.c}</span><span>{fmtMoney(x.total)}</span></div>)
            )}
          </div>
        </div>
        <div className="chip-row">
          <select className="select-inline" value={cat} onChange={(e) => setCat(e.target.value)}><option>Todas</option>{CATEGORIAS_GASTO.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="select-inline" value={tienda} onChange={(e) => setTienda(e.target.value)}><option>Todas</option>{TIENDAS.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        {filtered.length === 0 ? <Empty title="Sin gastos para estos filtros" /> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Monto</th><th>Tienda</th></tr></thead>
              <tbody>{filtered.map((g) => (<tr key={g.id}><td>{fmtDateShort(g.fecha)}</td><td>{g.categoria}</td><td>{g.descripcion}</td><td>{fmtMoney(g.monto)}</td><td>{g.tienda}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
