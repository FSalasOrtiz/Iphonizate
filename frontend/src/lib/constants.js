import {
  LayoutDashboard, ShoppingCart, CalendarClock, ShieldCheck, Users, ListChecks,
  Package, Boxes, ArrowLeftRight, Wrench, Headphones, Tag, Wallet, ClipboardCheck,
  Receipt, Target, BarChart3, FileSearch, Settings, UserCog,
} from "lucide-react";

export const TIENDAS = ["Black Pink Phone", "Riffstore", "iPhonizate", "Bodega central"];

export const TIENDA_COLOR = {
  "Black Pink Phone": "#ec1f80",
  Riffstore: "#8b5cf6",
  iPhonizate: "#f59e0b",
  "Bodega central": "#38bdf8",
};

export const ESTADO_LABELS = {
  disponible: "Disponible",
  por_revisar: "Por revisar",
  en_tecnico: "En técnico",
  reservado: "Reservado",
  garantia: "Garantía",
  vendido: "Vendido",
  entregado: "Entregado",
};

export const ESTADO_TONE = {
  disponible: "green",
  por_revisar: "yellow",
  en_tecnico: "blue",
  reservado: "purple",
  garantia: "red",
  vendido: "gray",
  entregado: "gray",
};

export const CATEGORIAS_ACCESORIO = ["Cargador", "Carcasa", "Mica", "Audífonos", "Otro"];
export const CATEGORIAS_GASTO = ["Arriendo", "Remuneraciones", "Publicidad", "Servicios", "Otro"];
export const METODOS_PAGO = ["Efectivo", "Transferencia", "Crédito", "Parte de pago"];
export const URGENCIAS = ["Alta", "Media", "Baja"];
export const ROLES = ["Dirección", "Vendedor", "Técnico"];

export const NAV = [
  { group: "", items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "OPERACIÓN",
    items: [
      { id: "vender", label: "Vender", icon: ShoppingCart },
      { id: "reservas", label: "Reservas", icon: CalendarClock },
      { id: "garantias", label: "Garantías", icon: ShieldCheck },
      { id: "clientes", label: "Clientes", icon: Users },
      { id: "tareas", label: "Tareas", icon: ListChecks },
    ],
  },
  {
    group: "INVENTARIO",
    items: [
      { id: "stock", label: "Stock", icon: Package },
      { id: "inventario", label: "Inventario", icon: Boxes },
      { id: "movimientos", label: "Movimientos", icon: ArrowLeftRight },
      { id: "tecnico", label: "Técnico", icon: Wrench },
      { id: "accesorios", label: "Accesorios", icon: Headphones },
      { id: "precios", label: "Precios", icon: Tag },
    ],
  },
  {
    group: "ADMINISTRACIÓN",
    items: [
      { id: "caja", label: "Caja", icon: Wallet },
      { id: "revision", label: "Revisión de pagos", icon: ClipboardCheck },
      { id: "gastos", label: "Gastos", icon: Receipt },
      { id: "metas", label: "Metas", icon: Target },
      { id: "reportes", label: "Reportes", icon: BarChart3 },
      { id: "auditoria", label: "Auditoría", icon: FileSearch },
      { id: "usuarios", label: "Usuarios", icon: UserCog, roles: ["Dirección"] },
      { id: "configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

export const PAGE_META = {
  dashboard: ["Dashboard", "Resumen del día"],
  vender: ["Vender", "Arma una venta y ciérrala"],
  reservas: ["Reservas", "Equipos apartados con abono · no cuentan como venta hasta completarse"],
  garantias: ["Garantías", "Solicitudes de garantía, SLA de 72 horas y resoluciones por reparación o cambio."],
  clientes: ["Clientes", "Historial de compras, garantías y contacto."],
  tareas: ["Tareas", "Pendientes del equipo por urgencia y responsable."],
  stock: ["Stock", "Equipos disponibles por tienda, con batería, capacidad y precio de lista."],
  inventario: ["Inventario", "Equipos de la cadena por IMEI, estado, ubicación y días en stock."],
  movimientos: ["Movimientos", "Traslados entre tiendas y bodega, con trazabilidad por equipo."],
  tecnico: ["Técnico", "Asignación de equipos a técnicos, seguimiento en taller y reparaciones hechas."],
  accesorios: ["Accesorios", "Catálogo de accesorios con stock por tienda, mínimos y ajustes registrados."],
  precios: ["Precios", "Precios sugeridos por modelo y capacidad, con control de actualización."],
  caja: ["Caja", "Cierre de la tienda del día seleccionado"],
  revision: ["Revisión de pagos", "Control de las formas de pago de cada venta"],
  gastos: ["Gastos", "Arriendos, remuneraciones, publicidad y gastos operativos por tienda."],
  metas: ["Metas", "Progreso mensual por tienda"],
  reportes: ["Reportes", "Ventas, margen y rotación por período y tienda. Todo excluye las ventas anuladas."],
  auditoria: ["Auditoría", "Registro de cambios de precio, stock y accesos."],
  usuarios: ["Usuarios", "Gestiona quién puede entrar al sistema y con qué rol."],
  configuracion: ["Configuración", "Los Mac que leen los equipos por USB."],
};
