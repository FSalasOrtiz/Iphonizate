# iPhonizate OS

Panel de gestión para tiendas de celulares — ventas, reservas, garantías,
inventario, técnico, caja, reportes, auditoría y más.

Este repo tiene dos partes:

```
frontend/   App en React (Vite) — lo que ve el usuario
backend/    API en Node/Express + PostgreSQL — login y datos compartidos
```

Antes los datos vivían solo en el navegador (`localStorage`). Ahora viven en
una base de datos real: cualquier dispositivo con sesión ve la misma
información, y hay login de verdad (usuario + PIN, con el PIN encriptado).

## Correrlo en tu computador

**1. Levanta la base de datos** (necesitas [Docker](https://docs.docker.com/get-docker/) instalado):
```bash
docker compose up -d
```

**2. Prepara y levanta el backend** (en una terminal):
```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```
Debería quedar corriendo en `http://localhost:4000`.

**3. Prepara y levanta el frontend** (en otra terminal, sin cerrar la anterior):
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Abre la URL que te muestre (normalmente `http://localhost:5173`).

**4. Entra con las credenciales de prueba:**
- Usuario: `renato`
- PIN: `123456`

(Puedes cambiarlas editando `SEED_PIN` etc. en `backend/.env` antes de
correr `npm run seed`, o volviendo a correr el seed con otros valores.)

## Cómo ponerlo en internet (para usarlo desde `iphonizate.app` de nuevo)

La forma más simple para partir:

1. **Backend + base de datos → [Railway](https://railway.app)**
   Instrucciones detalladas en `backend/README.md`. En resumen: subes el
   código, agregas un plugin de Postgres, defines las variables de entorno,
   y Railway te da una URL pública para tu API.

2. **Frontend → cualquier hosting de sitios estáticos** (Vercel, Netlify,
   Cloudflare Pages, o el mismo Railway). El build es `npm run build` dentro
   de `frontend/`, que genera una carpeta `dist/` lista para servir. Define
   `VITE_API_URL` apuntando a la URL de tu backend en Railway.

3. **Dominio propio**: una vez que el frontend esté desplegado, conectas tu
   dominio `iphonizate.app` desde el panel del hosting que elijas (todos
   tienen una sección de "Custom domain").

Si en algún punto te trabas con el despliegue, cuéntame en qué paso estás y
seguimos desde ahí — no hace falta que lo resuelvas todo de una vez.

## Qué NO incluye todavía (para ser honesto sobre el alcance)

- Pantalla para crear/editar usuarios desde la app (por ahora se hace con
  `npm run seed` en el backend).
- Roles con permisos distintos (todos los que inician sesión ven todo).
- Backups automáticos de la base de datos — eso depende del proveedor que
  elijas (Railway y Render ofrecen backups en sus planes pagos).
- El lector USB de Mac sigue siendo solo el formulario de referencia; eso
  requeriría una app nativa aparte.

Todo esto es agregable después si lo necesitas — dímelo y lo vemos.
