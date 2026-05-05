# OrionTek — Gestión de Clientes y Direcciones

Aplicación full-stack para administrar clientes y sus múltiples direcciones (relación 1:N).

| Capa | Stack |
|---|---|
| Frontend | React 19 · Vite · TypeScript · MUI v9 · React Query · Zustand · React Router v7 · React Hook Form · Zod |
| Backend | NestJS 11 · Prisma · PostgreSQL · JWT (access + refresh) · class-validator |
| Tests | Jest + Supertest (backend e2e) · Playwright (frontend e2e) |

```
.
├── client/   # SPA React
└── server/   # API REST NestJS
```

## Requisitos

- Node.js ≥ 20
- pnpm ≥ 9
- PostgreSQL accesible (Neon, Supabase, local, etc.)

## Variables de entorno

### `server/.env`

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
PORT=3000
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

### `client/.env`

```
VITE_API_URL=http://localhost:3000/api
```

Hay un `.env.example` en cada carpeta como referencia.

## Puesta en marcha

### 1. Backend

```bash
cd server
pnpm install
pnpm db:deploy   # aplica migraciones a la base de datos
pnpm db:seed     # inserta usuario admin + 5 clientes con direcciones
pnpm start:dev
```

API disponible en `http://localhost:3000/api`.

### 2. Frontend

En otra terminal:

```bash
cd client
pnpm install
pnpm dev
```

App disponible en `http://localhost:5173`.

## Credenciales de prueba

```
email:    admin@oriontek.com
password: Admin123!
```

(Generadas por el seed.)

## API

Todos los endpoints viven bajo `/api`. Salvo `auth/login` y `auth/refresh`, todos requieren `Authorization: Bearer <accessToken>`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Inicia sesión, devuelve `accessToken` + `refreshToken` + `user` |
| POST | `/auth/refresh` | Renueva tokens a partir del refresh token |
| POST | `/auth/logout` | Cierra sesión (stateless) |
| GET | `/auth/me` | Devuelve el usuario autenticado |
| GET | `/clientes` | Lista clientes con conteo de direcciones |
| GET | `/clientes/:id` | Detalle de cliente con sus direcciones |
| POST | `/clientes` | Crea cliente con al menos una dirección (transaccional) |
| PUT | `/clientes/:id` | Actualiza cliente y sincroniza direcciones (update / create / delete en una transacción) |
| DELETE | `/clientes/:id` | Elimina cliente (cascade en direcciones) |
| GET | `/direcciones` | Lista global de direcciones con su cliente |
| GET | `/dashboard/stats` | KPIs y últimos clientes |

Errores siguen el formato:

```json
{ "status": "error", "message": "...", "errors": [] }
```

## Tests

### Backend (Jest + Supertest)

```bash
cd server
pnpm test:e2e
```

Cubre el flujo completo de auth + CRUD de clientes/direcciones (login fail/ok, refresh, /me, listado, detalle, creación, actualización con sync de direcciones, eliminación, validaciones 400/401/404/409).

### Frontend (Playwright)

```bash
cd client
pnpm exec playwright install chromium   # solo la primera vez
pnpm test:e2e
```

Requiere que el backend esté corriendo en `http://localhost:3000`. Cubre login fallido/exitoso, ruta protegida, logout, y el ciclo completo crear → ver detalle → editar (renombrando, agregando y eliminando direcciones) → eliminar, además de la navegación entre Dashboard, Clientes y Direcciones.

## Scripts útiles

### `server`

| Script | |
|---|---|
| `pnpm start:dev` | API en modo watch |
| `pnpm build` | Compila TypeScript a `dist/` |
| `pnpm start:prod` | Corre el bundle compilado |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:deploy` | `prisma migrate deploy` (producción) |
| `pnpm db:seed` | Inserta datos de prueba |
| `pnpm test:e2e` | Suite de pruebas e2e |

### `client`

| Script | |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Bundle de producción |
| `pnpm preview` | Sirve el bundle build |
| `pnpm test:e2e` | Playwright headless |
| `pnpm test:e2e:ui` | Playwright en modo UI |

## Estructura de datos

```
User      ─ id, email (unique), password (hash), name, createdAt, updatedAt
Cliente   ─ id, nombre, apellido, email (unique), telefono?, createdAt, updatedAt
            └── direcciones: Direccion[]
Direccion ─ id, calle, ciudad, provincia, codigoPostal?, clienteId (FK CASCADE), createdAt, updatedAt
```

La actualización de un cliente sincroniza sus direcciones en una sola transacción: las que vienen con `id` se actualizan, las que no se crean, y las que existían previamente y no aparecen en el body se eliminan.
