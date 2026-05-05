# OrionTek — Gestión de Clientes y Direcciones
## Documentación de Tickets de Desarrollo

> **Objetivo:** Construir una aplicación Full Stack con ReactJS que permita gestionar clientes y sus múltiples direcciones.
> **Stack sugerido:** React + TypeScript · Node.js + Express o NestJS · PostgreSQL + Prisma · Tailwind CSS

---

## Estructura de Epics

| ID | Epic | Descripción |
|----|------|-------------|
| E-01 | Setup del Proyecto | Configuración inicial del repositorio, estructura y herramientas |
| E-02 | Backend — API REST | Diseño de base de datos y endpoints |
| E-03 | Frontend — UI/UX | Componentes, vistas y flujos de usuario |
| E-04 | Integración y calidad | Conexión frontend-backend, validaciones y manejo de errores |
| E-05 | Deploy y documentación | README, deploy y entrega |

---

## E-01 · Setup del Proyecto

---

### TICKET-001 · Inicializar repositorio y estructura de carpetas

**Tipo:** Task  
**Epic:** E-01  
**Prioridad:** Alta  
**Estimado:** 30 min

**Descripción:**  
Crear el repositorio público en GitHub con la estructura base del proyecto separada en `/client` y `/server` (monorepo simple o repositorio único con carpetas separadas).

**Criterios de aceptación:**
- [ ] Repositorio público creado en GitHub
- [ ] Carpeta `/client` con app React inicializada (Vite + TypeScript recomendado)
- [ ] Carpeta `/server` con proyecto Node.js inicializado
- [ ] `.gitignore` configurado para ambos entornos (node_modules, .env, dist)
- [ ] Commit inicial pusheado a `main`

**Notas técnicas:**
- Usar `npm create vite@latest client -- --template react-ts` para el frontend
- Usar `npm init` + instalar dependencias manualmente para el backend, o usar el CLI de NestJS

---

### TICKET-002 · Configurar ESLint, Prettier y TypeScript

**Tipo:** Task  
**Epic:** E-01  
**Prioridad:** Media  
**Estimado:** 20 min

**Descripción:**  
Establecer las herramientas de calidad de código en ambos proyectos para mantener consistencia y buenas prácticas.

**Criterios de aceptación:**
- [ ] ESLint configurado en `/client` y `/server`
- [ ] Prettier configurado con reglas base (singleQuote, semicolons, etc.)
- [ ] `tsconfig.json` ajustado con `strict: true` en ambos
- [ ] Scripts `lint` y `format` disponibles en `package.json`

---

### TICKET-003 · Configurar variables de entorno

**Tipo:** Task  
**Epic:** E-01  
**Prioridad:** Alta  
**Estimado:** 15 min

**Descripción:**  
Definir la estructura de archivos `.env` para el backend (conexión a DB, puerto) y `.env` para el frontend (URL de la API).

**Criterios de aceptación:**
- [ ] Archivo `.env.example` en `/server` con todas las variables necesarias documentadas
- [ ] Archivo `.env.example` en `/client` con `VITE_API_URL`
- [ ] Variables cargadas correctamente en cada entorno
- [ ] Archivos `.env` reales excluidos del repositorio

**Variables mínimas del servidor:**
```
DATABASE_URL=
PORT=
```

---

## E-02 · Backend — API REST

---

### TICKET-004 · Diseñar e implementar el schema de base de datos

**Tipo:** Task  
**Epic:** E-02  
**Prioridad:** Alta  
**Estimado:** 45 min  
**Bloqueado por:** TICKET-001

**Descripción:**  
Modelar las entidades `Cliente` y `Direccion` con su relación 1:N y crear las migraciones correspondientes.

**Entidades requeridas:**

```
Cliente
├── id          (PK, autoincrement o UUID)
├── nombre      (string, requerido)
├── apellido    (string, requerido)
├── email       (string, único, requerido)
├── telefono    (string, opcional)
├── createdAt
└── updatedAt

Direccion
├── id          (PK)
├── calle       (string, requerido)
├── ciudad      (string, requerido)
├── provincia   (string, requerido)
├── codigoPostal (string, opcional)
├── clienteId   (FK → Cliente.id, CASCADE DELETE)
├── createdAt
└── updatedAt
```

**Criterios de aceptación:**
- [ ] Schema definido en Prisma (o equivalente con el ORM elegido)
- [ ] Relación 1:N correctamente configurada con CASCADE DELETE
- [ ] Migración ejecutada exitosamente en base de datos local
- [ ] Seed opcional con datos de prueba

---

### TICKET-005 · Implementar endpoint: Listar clientes

**Tipo:** Feature  
**Epic:** E-02  
**Prioridad:** Alta  
**Estimado:** 30 min  
**Bloqueado por:** TICKET-004

**Descripción:**  
Crear el endpoint que retorna todos los clientes registrados, incluyendo el conteo de sus direcciones.

**Especificación:**

```
GET /api/clientes

Response 200:
{
  "data": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@email.com",
      "telefono": "809-000-0000",
      "_count": { "direcciones": 2 },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Criterios de aceptación:**
- [ ] Endpoint responde con status 200
- [ ] Retorna array de clientes con conteo de direcciones
- [ ] Maneja el caso de lista vacía (retorna array vacío, no error)
- [ ] Probado con Postman o Thunder Client

---

### TICKET-006 · Implementar endpoint: Obtener cliente por ID

**Tipo:** Feature  
**Epic:** E-02  
**Prioridad:** Alta  
**Estimado:** 20 min  
**Bloqueado por:** TICKET-004

**Descripción:**  
Endpoint que retorna un cliente específico con todas sus direcciones incluidas.

**Especificación:**

```
GET /api/clientes/:id

Response 200:
{
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@email.com",
    "telefono": "809-000-0000",
    "direcciones": [
      {
        "id": 1,
        "calle": "Av. 27 de Febrero #45",
        "ciudad": "Santo Domingo",
        "provincia": "Distrito Nacional",
        "codigoPostal": "10101"
      }
    ]
  }
}

Response 404:
{ "message": "Cliente no encontrado" }
```

**Criterios de aceptación:**
- [ ] Retorna cliente con su array de direcciones
- [ ] Retorna 404 si el ID no existe
- [ ] Retorna 400 si el ID no es un formato válido

---

### TICKET-007 · Implementar endpoint: Crear cliente

**Tipo:** Feature  
**Epic:** E-02  
**Prioridad:** Alta  
**Estimado:** 45 min  
**Bloqueado por:** TICKET-004

**Descripción:**  
Endpoint para crear un nuevo cliente con al menos una dirección incluida en el mismo request (creación en transacción).

**Especificación:**

```
POST /api/clientes

Body:
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "telefono": "809-000-0000",
  "direcciones": [
    {
      "calle": "Av. 27 de Febrero #45",
      "ciudad": "Santo Domingo",
      "provincia": "Distrito Nacional",
      "codigoPostal": "10101"
    }
  ]
}

Response 201: { "data": { ...clienteCreado } }
Response 400: { "message": "...", "errors": [...] }
Response 409: { "message": "El email ya está registrado" }
```

**Criterios de aceptación:**
- [ ] Crea cliente y direcciones en una sola transacción de DB
- [ ] Valida que `nombre`, `apellido` y `email` sean requeridos
- [ ] Valida formato de email
- [ ] Valida que `direcciones` tenga al menos 1 elemento
- [ ] Retorna 409 si el email ya existe
- [ ] Si la transacción falla, no se guarda nada (rollback)

---

### TICKET-008 · Implementar endpoint: Actualizar cliente

**Tipo:** Feature  
**Epic:** E-02  
**Prioridad:** Alta  
**Estimado:** 45 min  
**Bloqueado por:** TICKET-004

**Descripción:**  
Endpoint para actualizar los datos de un cliente y gestionar sus direcciones (agregar nuevas, editar existentes, eliminar).

**Especificación:**

```
PUT /api/clientes/:id

Body:
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "email": "juanc@email.com",
  "telefono": "809-111-1111",
  "direcciones": [
    { "id": 1, "calle": "Calle Nueva #10", "ciudad": "Santiago", "provincia": "Santiago" },
    { "calle": "Av. Lincoln #5", "ciudad": "Santo Domingo", "provincia": "Distrito Nacional" }
  ]
}

Response 200: { "data": { ...clienteActualizado } }
Response 404: { "message": "Cliente no encontrado" }
```

**Criterios de aceptación:**
- [ ] Actualiza campos del cliente
- [ ] Direcciones con `id` existente son actualizadas
- [ ] Direcciones sin `id` son creadas como nuevas
- [ ] Direcciones que existían pero no vienen en el body son eliminadas
- [ ] Retorna 404 si el cliente no existe
- [ ] Operación ejecutada en transacción

---

### TICKET-009 · Implementar endpoint: Eliminar cliente

**Tipo:** Feature  
**Epic:** E-02  
**Prioridad:** Alta  
**Estimado:** 20 min  
**Bloqueado por:** TICKET-004

**Descripción:**  
Endpoint para eliminar un cliente y, en cascada, todas sus direcciones.

**Especificación:**

```
DELETE /api/clientes/:id

Response 200: { "message": "Cliente eliminado correctamente" }
Response 404: { "message": "Cliente no encontrado" }
```

**Criterios de aceptación:**
- [ ] Elimina el cliente y sus direcciones (cascade configurado en DB)
- [ ] Retorna 404 si el ID no existe
- [ ] Retorna confirmación en el response

---

### TICKET-010 · Implementar middleware de manejo de errores global

**Tipo:** Task  
**Epic:** E-02  
**Prioridad:** Media  
**Estimado:** 30 min  
**Bloqueado por:** TICKET-005, TICKET-006, TICKET-007, TICKET-008, TICKET-009

**Descripción:**  
Centralizar el manejo de errores del servidor para que todos los endpoints retornen respuestas consistentes.

**Criterios de aceptación:**
- [ ] Middleware captura errores no controlados
- [ ] Errores de validación retornan 400 con detalle de campos
- [ ] Errores de "no encontrado" retornan 404
- [ ] Errores inesperados retornan 500 sin exponer stack trace en producción
- [ ] Formato de error consistente en todos los endpoints

```json
// Formato estándar de error
{
  "status": "error",
  "message": "Descripción del error",
  "errors": [] // opcional, para errores de validación
}
```

---

## E-03 · Frontend — UI/UX

---

### TICKET-011 · Configurar React Router y layout principal

**Tipo:** Task  
**Epic:** E-03  
**Prioridad:** Alta  
**Estimado:** 30 min  
**Bloqueado por:** TICKET-001

**Descripción:**  
Configurar el sistema de rutas de la aplicación y el layout base (header, sidebar o navbar) que se mantiene entre páginas.

**Rutas requeridas:**
```
/               → Redirige a /clientes
/clientes       → Lista de clientes
/clientes/nuevo → Formulario para crear cliente
/clientes/:id   → Detalle del cliente
/clientes/:id/editar → Formulario de edición
```

**Criterios de aceptación:**
- [ ] React Router v6 configurado
- [ ] Navegación entre rutas funcional
- [ ] Layout con navbar visible en todas las páginas
- [ ] Ruta 404 con página de error amigable

---

### TICKET-012 · Configurar cliente HTTP (API Service Layer)

**Tipo:** Task  
**Epic:** E-03  
**Prioridad:** Alta  
**Estimado:** 30 min  
**Bloqueado por:** TICKET-001

**Descripción:**  
Crear una capa de servicio que centralice todas las llamadas a la API del backend, evitando hacer `fetch` directo en los componentes.

**Criterios de aceptación:**
- [ ] Instancia de `axios` configurada con `baseURL` desde variable de entorno
- [ ] Interceptor para manejo de errores HTTP centralizado
- [ ] Archivo `services/clienteService.ts` con funciones: `getClientes`, `getClienteById`, `createCliente`, `updateCliente`, `deleteCliente`
- [ ] Tipos TypeScript definidos para `Cliente` y `Direccion`

**Estructura sugerida:**
```
src/
├── services/
│   └── clienteService.ts
├── types/
│   └── cliente.types.ts
└── lib/
    └── axios.ts
```

---

### TICKET-013 · Implementar vista: Lista de clientes

**Tipo:** Feature  
**Epic:** E-03  
**Prioridad:** Alta  
**Estimado:** 1 hora  
**Bloqueado por:** TICKET-011, TICKET-012

**Descripción:**  
Página principal que muestra todos los clientes en una tabla o lista de cards, con opciones de acción por cada uno.

**Criterios de aceptación:**
- [ ] Muestra nombre, apellido, email y cantidad de direcciones por cliente
- [ ] Botón "Nuevo Cliente" que navega a `/clientes/nuevo`
- [ ] Cada fila/card tiene acciones: Ver, Editar, Eliminar
- [ ] Estado de carga (skeleton o spinner) mientras se obtienen los datos
- [ ] Estado vacío con mensaje y botón para crear cuando no hay clientes
- [ ] Confirmación antes de eliminar (modal o `confirm`)
- [ ] Responsive: se adapta a móvil (cards en vez de tabla, o tabla con scroll horizontal)

---

### TICKET-014 · Implementar vista: Detalle de cliente

**Tipo:** Feature  
**Epic:** E-03  
**Prioridad:** Alta  
**Estimado:** 45 min  
**Bloqueado por:** TICKET-011, TICKET-012

**Descripción:**  
Página que muestra la información completa de un cliente con todas sus direcciones listadas.

**Criterios de aceptación:**
- [ ] Muestra todos los campos del cliente
- [ ] Lista todas las direcciones del cliente
- [ ] Botón "Editar" que navega a `/clientes/:id/editar`
- [ ] Botón "Volver" que regresa a la lista
- [ ] Maneja estado de carga
- [ ] Muestra error si el cliente no existe (redirige o muestra mensaje)

---

### TICKET-015 · Implementar formulario: Crear cliente

**Tipo:** Feature  
**Epic:** E-03  
**Prioridad:** Alta  
**Estimado:** 1.5 horas  
**Bloqueado por:** TICKET-011, TICKET-012

**Descripción:**  
Formulario para crear un nuevo cliente con sección dinámica para agregar múltiples direcciones.

**Campos del formulario:**

Cliente:
- Nombre (requerido)
- Apellido (requerido)  
- Email (requerido, formato válido)
- Teléfono (opcional)

Direcciones (sección dinámica, mínimo 1):
- Calle (requerido)
- Ciudad (requerido)
- Provincia (requerido)
- Código Postal (opcional)

**Criterios de aceptación:**
- [ ] Validación en cliente antes de enviar (React Hook Form + Zod o Yup recomendado)
- [ ] Botón "Agregar Dirección" que añade un nuevo bloque de campos
- [ ] Botón "Eliminar" por cada dirección (excepto cuando solo hay una)
- [ ] Mensajes de error inline por campo
- [ ] Botón submit deshabilitado mientras se envía el request
- [ ] Al crear exitosamente, redirige a la lista con mensaje de éxito
- [ ] Maneja errores del backend (ej: email duplicado)

---

### TICKET-016 · Implementar formulario: Editar cliente

**Tipo:** Feature  
**Epic:** E-03  
**Prioridad:** Alta  
**Estimado:** 1 hora  
**Bloqueado por:** TICKET-015

**Descripción:**  
Formulario pre-rellenado con los datos actuales del cliente para edición, reutilizando los componentes del formulario de creación.

**Criterios de aceptación:**
- [ ] Carga los datos del cliente y los pre-rellena en el formulario
- [ ] Permite agregar nuevas direcciones y eliminar existentes
- [ ] Las mismas validaciones que el formulario de creación
- [ ] Estado de carga mientras se obtienen los datos
- [ ] Al guardar exitosamente, redirige al detalle del cliente
- [ ] Botón "Cancelar" que descarta cambios y regresa

**Nota técnica:** Considera extraer el formulario a un componente `ClienteForm` reutilizable que reciba un prop `initialValues` para manejar tanto creación como edición.

---

### TICKET-017 · Implementar componente de notificaciones (Toast)

**Tipo:** Task  
**Epic:** E-03  
**Prioridad:** Media  
**Estimado:** 20 min

**Descripción:**  
Sistema de notificaciones para dar feedback al usuario tras acciones exitosas o errores.

**Criterios de aceptación:**
- [ ] Toast de éxito (verde) al crear/editar/eliminar
- [ ] Toast de error (rojo) cuando falla una operación
- [ ] Se cierra automáticamente después de 3-5 segundos
- [ ] Se puede usar desde cualquier componente (Context o librería como `react-hot-toast`)

---

## E-04 · Integración y Calidad

---

### TICKET-018 · Conectar frontend con backend y probar flujos completos

**Tipo:** Task  
**Epic:** E-04  
**Prioridad:** Alta  
**Estimado:** 1 hora  
**Bloqueado por:** TICKET-010, TICKET-017

**Descripción:**  
Verificar que todos los flujos de usuario funcionen de extremo a extremo con el backend real.

**Flujos a verificar:**
- [ ] Crear cliente con 1 dirección → aparece en lista
- [ ] Crear cliente con 3 direcciones → detalle muestra las 3
- [ ] Editar cliente: cambiar nombre y agregar dirección
- [ ] Editar cliente: eliminar una dirección existente
- [ ] Eliminar cliente → desaparece de la lista y sus direcciones también
- [ ] Intentar crear con email duplicado → muestra error correcto
- [ ] Navegar a ID inexistente → muestra error correcto

---

### TICKET-019 · Manejo de errores de red y estados de carga

**Tipo:** Task  
**Epic:** E-04  
**Prioridad:** Media  
**Estimado:** 45 min

**Descripción:**  
Asegurar que la aplicación se comporta de forma controlada ante fallos de red o respuestas lentas del servidor.

**Criterios de aceptación:**
- [ ] Si el backend no responde, muestra mensaje de error amigable (no pantalla en blanco)
- [ ] Botones de submit muestran estado loading y se deshabilitan durante el request
- [ ] Errores 500 del servidor muestran mensaje genérico (no stack trace)
- [ ] Errores de validación del backend se mapean a los campos del formulario correspondientes

---

### TICKET-020 · Revisar responsive design en móvil

**Tipo:** Task  
**Epic:** E-04  
**Prioridad:** Media  
**Estimado:** 30 min

**Descripción:**  
Verificar y ajustar el diseño para que sea completamente usable en pantallas pequeñas (≤ 375px).

**Criterios de aceptación:**
- [ ] Lista de clientes legible en móvil
- [ ] Formularios usables en móvil (inputs suficientemente grandes)
- [ ] Botones de acción accesibles en móvil
- [ ] Sin desbordamiento horizontal en ninguna vista
- [ ] Probado en Chrome DevTools en viewport 375px

---

## E-05 · Deploy y Documentación

---

### TICKET-021 · Escribir README del proyecto

**Tipo:** Task  
**Epic:** E-05  
**Prioridad:** Alta  
**Estimado:** 30 min

**Descripción:**  
Documentar el proyecto para que cualquier evaluador pueda levantarlo localmente en menos de 5 minutos.

**El README debe incluir:**
- [ ] Descripción del proyecto
- [ ] Stack tecnológico utilizado
- [ ] Requisitos previos (Node version, PostgreSQL, etc.)
- [ ] Variables de entorno necesarias (con ejemplo)
- [ ] Pasos para correr el backend
- [ ] Pasos para correr el frontend
- [ ] Cómo correr las migraciones / seed
- [ ] Screenshots de la aplicación (opcional pero suma puntos)
- [ ] URL del deploy si aplica

---

### TICKET-022 · Deploy de la aplicación (opcional, suma puntos)

**Tipo:** Task  
**Epic:** E-05  
**Prioridad:** Baja  
**Estimado:** 1 hora

**Descripción:**  
Desplegar frontend y backend en plataformas gratuitas para que el evaluador pueda probar sin instalar nada.

**Plataformas recomendadas:**
- **Frontend:** Vercel (conectar repo de GitHub, deploy automático)
- **Backend:** Railway o Render (soporte para Node.js + PostgreSQL)
- **Base de datos:** Railway PostgreSQL o Supabase (free tier)

**Criterios de aceptación:**
- [ ] Frontend accesible desde URL pública
- [ ] Backend API accesible y conectado a DB en la nube
- [ ] URLs documentadas en el README

---

## Orden de implementación sugerido

```
TICKET-001 → TICKET-002 → TICKET-003
     ↓
TICKET-004
     ↓
TICKET-005, TICKET-006, TICKET-007, TICKET-008, TICKET-009 (en paralelo)
     ↓
TICKET-010
     ↓
TICKET-011 → TICKET-012
     ↓
TICKET-013, TICKET-014 (en paralelo)
     ↓
TICKET-015 → TICKET-016
     ↓
TICKET-017 → TICKET-018 → TICKET-019 → TICKET-020
     ↓
TICKET-021 → TICKET-022
```

---

## Checklist final antes de entregar

- [ ] El repo es público en GitHub
- [ ] El README tiene instrucciones claras para correr el proyecto
- [ ] Todos los flujos CRUD funcionan end-to-end
- [ ] No hay `console.log` de debug en el código
- [ ] No hay credenciales hardcodeadas (usar `.env`)
- [ ] El código tiene nombres descriptivos (no `x`, `temp`, `data2`)
- [ ] La relación 1:N está correctamente implementada en DB y en la UI
- [ ] La aplicación es responsive

---

*Documento generado para práctica personal — Prueba Técnica OrionTek*
