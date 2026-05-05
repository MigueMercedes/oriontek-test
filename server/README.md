# OrionTek API

API REST construida con NestJS, Prisma y PostgreSQL. Maneja autenticación JWT (access + refresh) y CRUD de clientes con sus direcciones.

Ver el [README raíz](../README.md) para instrucciones de instalación, variables de entorno y referencia de endpoints.

## Comandos

```bash
pnpm install
pnpm db:deploy        # aplica migraciones
pnpm db:seed          # inserta admin + clientes de ejemplo
pnpm start:dev        # API en http://localhost:3000/api
pnpm test:e2e         # suite e2e completa
```
