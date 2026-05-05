import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedDireccion {
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
}

interface SeedCliente {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direcciones: SeedDireccion[];
}

const clientes: SeedCliente[] = [
  {
    nombre: 'María',
    apellido: 'Fernández',
    email: 'maria.fernandez@example.do',
    telefono: '+1 809 555 0101',
    direcciones: [
      {
        calle: 'Av. Winston Churchill 95',
        ciudad: 'Santo Domingo',
        provincia: 'Distrito Nacional',
        codigoPostal: '10148',
      },
      {
        calle: 'Calle El Conde 12',
        ciudad: 'Santo Domingo',
        provincia: 'Distrito Nacional',
        codigoPostal: '10210',
      },
    ],
  },
  {
    nombre: 'Carlos',
    apellido: 'Reyes',
    email: 'carlos.reyes@example.do',
    telefono: '+1 829 555 0102',
    direcciones: [
      {
        calle: 'Calle Duarte 45',
        ciudad: 'Santiago de los Caballeros',
        provincia: 'Santiago',
        codigoPostal: '51000',
      },
    ],
  },
  {
    nombre: 'Luisa',
    apellido: 'Peña',
    email: 'luisa.pena@example.do',
    telefono: '+1 849 555 0103',
    direcciones: [
      {
        calle: 'Av. Las Américas 20',
        ciudad: 'Santo Domingo Este',
        provincia: 'Santo Domingo',
        codigoPostal: '11506',
      },
      {
        calle: 'Calle Padre Billini 78',
        ciudad: 'Santo Domingo',
        provincia: 'Distrito Nacional',
        codigoPostal: '10210',
      },
      {
        calle: 'Av. Independencia 305',
        ciudad: 'Santo Domingo',
        provincia: 'Distrito Nacional',
        codigoPostal: '10103',
      },
    ],
  },
  {
    nombre: 'José',
    apellido: 'Martínez',
    email: 'jose.martinez@example.do',
    telefono: '+1 809 555 0104',
    direcciones: [
      {
        calle: 'Calle Mella 14',
        ciudad: 'La Vega',
        provincia: 'La Vega',
        codigoPostal: '41000',
      },
      {
        calle: 'Av. Pedro A. Rivera 88',
        ciudad: 'La Vega',
        provincia: 'La Vega',
      },
    ],
  },
  {
    nombre: 'Ana',
    apellido: 'Rodríguez',
    email: 'ana.rodriguez@example.do',
    telefono: '+1 809 555 0105',
    direcciones: [
      {
        calle: 'Calle Beller 23',
        ciudad: 'Puerto Plata',
        provincia: 'Puerto Plata',
        codigoPostal: '57000',
      },
    ],
  },
];

async function main() {
  const adminEmail = 'admin@oriontek.com';
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, name: 'Admin OrionTek' },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin OrionTek',
    },
  });

  for (const c of clientes) {
    const existing = await prisma.cliente.findUnique({ where: { email: c.email } });

    if (existing) {
      await prisma.cliente.update({
        where: { id: existing.id },
        data: {
          nombre: c.nombre,
          apellido: c.apellido,
          telefono: c.telefono,
        },
      });
      // Make seed idempotent for direcciones: replace them on re-run.
      await prisma.direccion.deleteMany({ where: { clienteId: existing.id } });
      await prisma.direccion.createMany({
        data: c.direcciones.map((d) => ({ ...d, clienteId: existing.id })),
      });
    } else {
      await prisma.cliente.create({
        data: {
          nombre: c.nombre,
          apellido: c.apellido,
          email: c.email,
          telefono: c.telefono,
          direcciones: { create: c.direcciones },
        },
      });
    }
  }

  // eslint-disable-next-line no-console
  console.log('Seed completado.');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
