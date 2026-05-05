import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { PrismaService } from './../src/prisma/prisma.service';

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
      expect(res.body.status).toBe('error');
    });

    it('POST /api/auth/login succeeds with valid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.refreshToken).toEqual(expect.any(String));
      expect(res.body.user).toMatchObject({
        email: ADMIN_EMAIL,
        name: 'Admin OrionTek',
      });
      expect(res.body.user.password).toBeUndefined();

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
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
      expect(res.body.user.email).toBe(ADMIN_EMAIL);
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
            { calle: 'Calle X', ciudad: 'Santo Domingo', provincia: 'Distrito Nacional' },
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
      expect(res.body.data).toMatchObject({
        nombre: 'Test',
        apellido: 'User',
        email: uniqueEmail,
      });
      expect(res.body.data.direcciones).toHaveLength(2);

      createdClienteId = res.body.data.id;
      direccionToKeepId = res.body.data.direcciones[0].id;
    });

    it('POST /api/clientes returns 409 on duplicate email', async () => {
      const res = await request(server)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          nombre: 'Other',
          apellido: 'Person',
          email: uniqueEmail,
          direcciones: [
            { calle: 'X', ciudad: 'Y', provincia: 'Z' },
          ],
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/email/i);
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
      expect(res.body.errors).toBeDefined();
    });

    it('GET /api/clientes lists clientes with _count.direcciones', async () => {
      const res = await request(server)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      const found = res.body.data.find((c: any) => c.id === createdClienteId);
      expect(found).toBeDefined();
      expect(found._count.direcciones).toBe(2);
    });

    it('GET /api/clientes/:id returns the cliente with direcciones', async () => {
      const res = await request(server)
        .get(`/api/clientes/${createdClienteId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdClienteId);
      expect(res.body.data.direcciones).toHaveLength(2);
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
      expect(res.body.data.nombre).toBe('Updated');
      expect(res.body.data.email).toBe(updatedEmail);
      expect(res.body.data.direcciones).toHaveLength(2);

      const ids = res.body.data.direcciones.map((d: any) => d.id);
      expect(ids).toContain(direccionToKeepId);

      const kept = res.body.data.direcciones.find(
        (d: any) => d.id === direccionToKeepId,
      );
      expect(kept.calle).toBe('Calle Principal Renombrada');

      const added = res.body.data.direcciones.find(
        (d: any) => d.id !== direccionToKeepId,
      );
      expect(added.calle).toBe('Nueva Calle Agregada');
    });

    it('DELETE /api/clientes/:id removes the cliente and the list reflects it', async () => {
      const res = await request(server)
        .delete(`/api/clientes/${createdClienteId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cliente eliminado correctamente');

      const list = await request(server)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${accessToken}`);

      const found = list.body.data.find((c: any) => c.id === createdClienteId);
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
      expect(Array.isArray(res.body.data)).toBe(true);

      if (res.body.data.length > 0) {
        const first = res.body.data[0];
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
      expect(res.body.data).toEqual(
        expect.objectContaining({
          totalClientes: expect.any(Number),
          totalDirecciones: expect.any(Number),
          promedioDireccionesPorCliente: expect.any(Number),
          nuevosUltimaSemana: expect.any(Number),
          recientes: expect.any(Array),
        }),
      );
      expect(res.body.data.recientes.length).toBeLessThanOrEqual(5);
      if (res.body.data.recientes.length > 0) {
        expect(res.body.data.recientes[0]).toHaveProperty('_count.direcciones');
      }
    });
  });

  describe('Refresh', () => {
    it('POST /api/auth/refresh issues new tokens with a valid refresh token', async () => {
      const res = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.refreshToken).toEqual(expect.any(String));
    });

    it('POST /api/auth/refresh returns 401 with garbage token', async () => {
      const res = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'this-is-not-a-valid-jwt' });

      expect(res.status).toBe(401);
    });
  });
});
