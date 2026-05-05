import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { PrismaService } from './../src/prisma/prisma.service';

interface ErrorBody {
  status?: string;
  message?: string;
  errors?: unknown[];
}

interface AuthBody {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; password?: undefined };
}

interface MeBody {
  user: { email: string };
}

interface Direccion {
  id: number;
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string | null;
}

interface ClienteListItem {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  _count: { direcciones: number };
}

interface ClienteDetail {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  direcciones: Direccion[];
}

interface DataBody<T> {
  data: T;
}

interface MessageBody {
  message: string;
}

interface DireccionWithCliente extends Direccion {
  cliente: { id: number; nombre: string; apellido: string; email: string };
}

interface DashboardStats {
  totalClientes: number;
  totalDirecciones: number;
  promedioDireccionesPorCliente: number;
  nuevosUltimaSemana: number;
  recientes: Array<ClienteListItem & { _count: { direcciones: number } }>;
}

const body = <T>(res: request.Response): T => res.body as T;

const ADMIN_EMAIL = 'admin@oriontek.com';
const ADMIN_PASSWORD = 'Admin123!';

describe('OrionTek API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let server: App;

  let accessToken = '';
  let refreshToken = '';

  const uniqueEmail = `test.${Date.now()}@oriontek.com`;
  const updatedEmail = `updated.${Date.now()}@oriontek.com`;
  let createdClienteId = 0;
  let direccionToKeepId = 0;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    server = app.getHttpServer();

    prisma = app.get(PrismaService);

    // Ensure admin user exists for login flow.
    const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: { password, name: 'Admin OrionTek' },
      create: {
        email: ADMIN_EMAIL,
        password,
        name: 'Admin OrionTek',
      },
    });
  });

  afterAll(async () => {
    if (createdClienteId) {
      await prisma.cliente
        .delete({ where: { id: createdClienteId } })
        .catch(() => undefined);
    }
    await app?.close();
  });

  describe('Auth', () => {
    it('POST /api/auth/login fails with invalid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(body<ErrorBody>(res).status).toBe('error');
    });

    it('POST /api/auth/login succeeds with valid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

      expect(res.status).toBe(200);
      const auth = body<AuthBody>(res);
      expect(auth.accessToken).toEqual(expect.any(String));
      expect(auth.refreshToken).toEqual(expect.any(String));
      expect(auth.user).toMatchObject({
        email: ADMIN_EMAIL,
        name: 'Admin OrionTek',
      });
      expect(auth.user.password).toBeUndefined();

      accessToken = auth.accessToken;
      refreshToken = auth.refreshToken;
    });

    it('GET /api/auth/me without token returns 401', async () => {
      const res = await request(server).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('GET /api/auth/me with token returns the user', async () => {
      const res = await request(server)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(body<MeBody>(res).user.email).toBe(ADMIN_EMAIL);
    });
  });

  describe('Clientes', () => {
    it('POST /api/clientes without auth returns 401', async () => {
      const res = await request(server)
        .post('/api/clientes')
        .send({
          nombre: 'Test',
          apellido: 'User',
          email: uniqueEmail,
          direcciones: [
            {
              calle: 'Calle X',
              ciudad: 'Santo Domingo',
              provincia: 'Distrito Nacional',
            },
          ],
        });

      expect(res.status).toBe(401);
    });

    it('POST /api/clientes creates a cliente with direcciones', async () => {
      const res = await request(server)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Test',
          apellido: 'User',
          email: uniqueEmail,
          telefono: '+1 809 555 0000',
          direcciones: [
            {
              calle: 'Calle Principal 1',
              ciudad: 'Santo Domingo',
              provincia: 'Distrito Nacional',
              codigoPostal: '10100',
            },
            {
              calle: 'Calle Secundaria 2',
              ciudad: 'Santiago',
              provincia: 'Santiago',
            },
          ],
        });

      expect(res.status).toBe(201);
      const created = body<DataBody<ClienteDetail>>(res).data;
      expect(created).toMatchObject({
        nombre: 'Test',
        apellido: 'User',
        email: uniqueEmail,
      });
      expect(created.direcciones).toHaveLength(2);

      createdClienteId = created.id;
      direccionToKeepId = created.direcciones[0].id;
    });

    it('POST /api/clientes returns 409 on duplicate email', async () => {
      const res = await request(server)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Other',
          apellido: 'Person',
          email: uniqueEmail,
          direcciones: [{ calle: 'X', ciudad: 'Y', provincia: 'Z' }],
        });

      expect(res.status).toBe(409);
      expect(body<ErrorBody>(res).message).toMatch(/email/i);
    });

    it('POST /api/clientes returns 400 when no direcciones provided', async () => {
      const res = await request(server)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Bad',
          apellido: 'Person',
          email: `bad.${Date.now()}@oriontek.com`,
          direcciones: [],
        });

      expect(res.status).toBe(400);
      expect(body<ErrorBody>(res).errors).toBeDefined();
    });

    it('GET /api/clientes lists clientes with _count.direcciones', async () => {
      const res = await request(server)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      const list = body<DataBody<ClienteListItem[]>>(res).data;
      expect(Array.isArray(list)).toBe(true);
      const found = list.find((c) => c.id === createdClienteId);
      expect(found).toBeDefined();
      expect(found?._count.direcciones).toBe(2);
    });

    it('GET /api/clientes/:id returns the cliente with direcciones', async () => {
      const res = await request(server)
        .get(`/api/clientes/${createdClienteId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      const cliente = body<DataBody<ClienteDetail>>(res).data;
      expect(cliente.id).toBe(createdClienteId);
      expect(cliente.direcciones).toHaveLength(2);
    });

    it('GET /api/clientes/:id returns 404 for unknown id', async () => {
      const res = await request(server)
        .get('/api/clientes/99999999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });

    it('GET /api/clientes/:id returns 400 for non-numeric id', async () => {
      const res = await request(server)
        .get('/api/clientes/not-a-number')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(400);
    });

    it('PUT /api/clientes/:id syncs direcciones (rename + update + add + delete)', async () => {
      const res = await request(server)
        .put(`/api/clientes/${createdClienteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Updated',
          apellido: 'User',
          email: updatedEmail,
          telefono: '+1 809 555 0001',
          direcciones: [
            {
              id: direccionToKeepId,
              calle: 'Calle Principal Renombrada',
              ciudad: 'Santo Domingo',
              provincia: 'Distrito Nacional',
              codigoPostal: '10100',
            },
            {
              calle: 'Nueva Calle Agregada',
              ciudad: 'La Romana',
              provincia: 'La Romana',
            },
          ],
        });

      expect(res.status).toBe(200);
      const updated = body<DataBody<ClienteDetail>>(res).data;
      expect(updated.nombre).toBe('Updated');
      expect(updated.email).toBe(updatedEmail);
      expect(updated.direcciones).toHaveLength(2);

      const ids = updated.direcciones.map((d) => d.id);
      expect(ids).toContain(direccionToKeepId);

      const kept = updated.direcciones.find((d) => d.id === direccionToKeepId);
      expect(kept?.calle).toBe('Calle Principal Renombrada');

      const added = updated.direcciones.find((d) => d.id !== direccionToKeepId);
      expect(added?.calle).toBe('Nueva Calle Agregada');
    });

    it('DELETE /api/clientes/:id removes the cliente and the list reflects it', async () => {
      const res = await request(server)
        .delete(`/api/clientes/${createdClienteId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(body<MessageBody>(res).message).toBe(
        'Cliente eliminado correctamente',
      );

      const list = await request(server)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`);

      const found = body<DataBody<ClienteListItem[]>>(list).data.find(
        (c) => c.id === createdClienteId,
      );
      expect(found).toBeUndefined();

      // Mark as already deleted so afterAll skips it.
      createdClienteId = 0;
    });
  });

  describe('Direcciones', () => {
    it('GET /api/direcciones returns direcciones with cliente', async () => {
      const res = await request(server)
        .get('/api/direcciones')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      const list = body<DataBody<DireccionWithCliente[]>>(res).data;
      expect(Array.isArray(list)).toBe(true);

      if (list.length > 0) {
        const first = list[0];
        expect(first).toHaveProperty('calle');
        expect(first).toHaveProperty('ciudad');
        expect(first).toHaveProperty('provincia');
        expect(first.cliente).toMatchObject({
          id: expect.any(Number),
          nombre: expect.any(String),
          apellido: expect.any(String),
          email: expect.any(String),
        });
      }
    });
  });

  describe('Dashboard', () => {
    it('GET /api/dashboard/stats returns the expected shape', async () => {
      const res = await request(server)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      const stats = body<DataBody<DashboardStats>>(res).data;
      expect(stats).toEqual(
        expect.objectContaining({
          totalClientes: expect.any(Number),
          totalDirecciones: expect.any(Number),
          promedioDireccionesPorCliente: expect.any(Number),
          nuevosUltimaSemana: expect.any(Number),
          recientes: expect.any(Array),
        }),
      );
      expect(stats.recientes.length).toBeLessThanOrEqual(5);
      if (stats.recientes.length > 0) {
        expect(stats.recientes[0]).toHaveProperty('_count.direcciones');
      }
    });
  });

  describe('Refresh', () => {
    it('POST /api/auth/refresh issues new tokens with a valid refresh token', async () => {
      const res = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      const tokens = body<AuthBody>(res);
      expect(tokens.accessToken).toEqual(expect.any(String));
      expect(tokens.refreshToken).toEqual(expect.any(String));
    });

    it('POST /api/auth/refresh returns 401 with garbage token', async () => {
      const res = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'this-is-not-a-valid-jwt' });

      expect(res.status).toBe(401);
    });
  });
});
